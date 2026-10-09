<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Models\DomainCredential;
use App\Models\Client;
use App\Models\Project;
use App\Models\ActivityLog;
use App\Http\Requests\StoreDomainRequest;
use App\Http\Requests\UpdateDomainRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class DomainController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('domains.view'), 403);

        $query = Domain::with(['client', 'project']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where('domain_name', $like, "%{$search}%")
                  ->orWhereHas('client', function ($q) use ($search, $like) {
                      $q->where('company_name', $like, "%{$search}%");
                  });
        }

        if ($request->has('status') && $request->input('status') !== 'All') {
            $query->where('status', $request->input('status'));
        }

        $domains = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Domains/Index', [
            'domains' => $domains,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('domains.create'), 403);

        $clients  = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $projects = Project::select('id', 'name', 'client_id')->orderBy('name')->get();

        return Inertia::render('Domains/Create', [
            'clients'  => $clients,
            'projects' => $projects,
        ]);
    }

    public function store(StoreDomainRequest $request)
    {
        abort_unless(auth()->user()->can('domains.create'), 403);

        DB::beginTransaction();
        try {
            $domain = Domain::create($request->safe()->except(['username', 'email', 'password', 'credential_notes']));

            if ($request->filled('username') || $request->filled('email') || $request->filled('password') || $request->filled('credential_notes')) {
                abort_unless(auth()->user()->can('credentials.create'), 403);
                DomainCredential::create([
                    'domain_id'          => $domain->id,
                    'username'           => $request->input('username'),
                    'email'              => $request->input('email'),
                    'encrypted_password' => $request->filled('password') ? Crypt::encryptString($request->input('password')) : null,
                    'notes'              => $request->input('credential_notes'),
                ]);
            }

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'created',
                'subject_type' => Domain::class,
                'subject_id'   => $domain->id,
                'new_values'   => $domain->toArray(),
            ]);

            DB::commit();
            return redirect()->route('domains.index')->with('success', 'Domain created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating domain: ' . $e->getMessage());
        }
    }

    public function show(Domain $domain)
    {
        abort_unless(auth()->user()->can('domains.view'), 403);

        $domain->load(['client', 'project', 'credential']);

        $canViewCredentials = auth()->user()->can('credentials.view');

        $decryptedPassword = null;
        if ($canViewCredentials && $domain->credential && $domain->credential->encrypted_password) {
            try {
                $decryptedPassword = Crypt::decryptString($domain->credential->encrypted_password);
            } catch (\Exception $e) {
                $decryptedPassword = 'Error decrypting password';
            }
        }

        $domainArray = $domain->toArray();
        if ($domain->credential) {
            if ($canViewCredentials) {
                $domainArray['credential']['decrypted_password'] = $decryptedPassword;
            } else {
                // Strip credential data for non-authorized users
                unset($domainArray['credential']);
            }
        }

        return Inertia::render('Domains/Show', [
            'domain'             => $domainArray,
            'canViewCredentials' => $canViewCredentials,
            'canEditCredentials' => auth()->user()->can('credentials.edit'),
        ]);
    }

    public function edit(Domain $domain)
    {
        abort_unless(auth()->user()->can('domains.edit'), 403);

        $domain->load('credential');
        $clients  = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $projects = Project::select('id', 'name', 'client_id')->orderBy('name')->get();

        $domainArray = $domain->toArray();
        if ($domain->credential) {
            unset($domainArray['credential']['encrypted_password']);
            // Remove credential data entirely if user can't edit credentials
            if (!auth()->user()->can('credentials.edit')) {
                unset($domainArray['credential']);
            }
        }

        return Inertia::render('Domains/Edit', [
            'domain'             => $domainArray,
            'clients'            => $clients,
            'projects'           => $projects,
            'canEditCredentials' => auth()->user()->can('credentials.edit'),
        ]);
    }

    public function update(UpdateDomainRequest $request, Domain $domain)
    {
        abort_unless(auth()->user()->can('domains.edit'), 403);

        DB::beginTransaction();
        try {
            $domain->update($request->safe()->except(['username', 'email', 'password', 'credential_notes']));

            $credentialData = [
                'username' => $request->input('username'),
                'email'    => $request->input('email'),
                'notes'    => $request->input('credential_notes'),
            ];

            if ($request->filled('password')) {
                abort_unless(auth()->user()->can('credentials.edit'), 403);
                $credentialData['encrypted_password'] = Crypt::encryptString($request->input('password'));
            }

            if (auth()->user()->can('credentials.edit')) {
                if ($domain->credential) {
                    $domain->credential->update($credentialData);
                } elseif ($request->filled('username') || $request->filled('email') || $request->filled('password') || $request->filled('credential_notes')) {
                    $credentialData['domain_id'] = $domain->id;
                    DomainCredential::create($credentialData);
                }
            }

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'updated',
                'subject_type' => Domain::class,
                'subject_id'   => $domain->id,
                'new_values'   => $domain->toArray(),
            ]);

            DB::commit();
            return redirect()->route('domains.index')->with('success', 'Domain updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating domain: ' . $e->getMessage());
        }
    }

    public function destroy(Domain $domain)
    {
        abort_unless(auth()->user()->can('domains.delete'), 403);

        DB::beginTransaction();
        try {
            if ($domain->credential) {
                $domain->credential->delete();
            }
            $domain->delete();

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'deleted',
                'subject_type' => Domain::class,
                'subject_id'   => $domain->id,
                'old_values'   => $domain->toArray(),
            ]);

            DB::commit();
            return redirect()->route('domains.index')->with('success', 'Domain deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting domain: ' . $e->getMessage());
        }
    }
}
