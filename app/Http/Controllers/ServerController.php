<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Models\ServerCredential;
use App\Models\Client;
use App\Models\Project;
use App\Models\ActivityLog;
use App\Http\Requests\StoreServerRequest;
use App\Http\Requests\UpdateServerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ServerController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('servers.view'), 403);

        $query = Server::with(['client', 'project']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'ilike', "%{$search}%")
                  ->orWhereHas('client', function ($q) use ($search) {
                      $q->where('company_name', 'ilike', "%{$search}%");
                  });
        }

        if ($request->has('status') && $request->input('status') !== 'All') {
            $query->where('status', $request->input('status'));
        }

        $servers = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Servers/Index', [
            'servers' => $servers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('servers.create'), 403);

        $clients  = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $projects = Project::select('id', 'name', 'client_id')->orderBy('name')->get();

        return Inertia::render('Servers/Create', [
            'clients'  => $clients,
            'projects' => $projects,
        ]);
    }

    public function store(StoreServerRequest $request)
    {
        abort_unless(auth()->user()->can('servers.create'), 403);

        DB::beginTransaction();
        try {
            $server = Server::create($request->safe()->except(['username', 'email', 'password', 'credential_notes']));

            if ($request->filled('username') || $request->filled('email') || $request->filled('password') || $request->filled('credential_notes')) {
                abort_unless(auth()->user()->can('credentials.create'), 403);
                ServerCredential::create([
                    'server_id'          => $server->id,
                    'username'           => $request->input('username'),
                    'email'              => $request->input('email'),
                    'encrypted_password' => $request->filled('password') ? Crypt::encryptString($request->input('password')) : null,
                    'notes'              => $request->input('credential_notes'),
                ]);
            }

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'created',
                'subject_type' => Server::class,
                'subject_id'   => $server->id,
                'new_values'   => $server->toArray(),
            ]);

            DB::commit();
            return redirect()->route('servers.index')->with('success', 'Server created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating server: ' . $e->getMessage());
        }
    }

    public function show(Server $server)
    {
        abort_unless(auth()->user()->can('servers.view'), 403);

        $server->load(['client', 'project', 'credential']);

        $canViewCredentials = auth()->user()->can('credentials.view');

        $decryptedPassword = null;
        if ($canViewCredentials && $server->credential && $server->credential->encrypted_password) {
            try {
                $decryptedPassword = Crypt::decryptString($server->credential->encrypted_password);
            } catch (\Exception $e) {
                $decryptedPassword = 'Error decrypting password';
            }
        }

        $serverArray = $server->toArray();
        if ($server->credential) {
            if ($canViewCredentials) {
                $serverArray['credential']['decrypted_password'] = $decryptedPassword;
            } else {
                unset($serverArray['credential']);
            }
        }

        return Inertia::render('Servers/Show', [
            'server'             => $serverArray,
            'canViewCredentials' => $canViewCredentials,
            'canEditCredentials' => auth()->user()->can('credentials.edit'),
        ]);
    }

    public function edit(Server $server)
    {
        abort_unless(auth()->user()->can('servers.edit'), 403);

        $server->load('credential');
        $clients  = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $projects = Project::select('id', 'name', 'client_id')->orderBy('name')->get();

        $serverArray = $server->toArray();
        if ($server->credential) {
            unset($serverArray['credential']['encrypted_password']);
            if (!auth()->user()->can('credentials.edit')) {
                unset($serverArray['credential']);
            }
        }

        return Inertia::render('Servers/Edit', [
            'server'             => $serverArray,
            'clients'            => $clients,
            'projects'           => $projects,
            'canEditCredentials' => auth()->user()->can('credentials.edit'),
        ]);
    }

    public function update(UpdateServerRequest $request, Server $server)
    {
        abort_unless(auth()->user()->can('servers.edit'), 403);

        DB::beginTransaction();
        try {
            $server->update($request->safe()->except(['username', 'email', 'password', 'credential_notes']));

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
                if ($server->credential) {
                    $server->credential->update($credentialData);
                } elseif ($request->filled('username') || $request->filled('email') || $request->filled('password') || $request->filled('credential_notes')) {
                    $credentialData['server_id'] = $server->id;
                    ServerCredential::create($credentialData);
                }
            }

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'updated',
                'subject_type' => Server::class,
                'subject_id'   => $server->id,
                'new_values'   => $server->toArray(),
            ]);

            DB::commit();
            return redirect()->route('servers.index')->with('success', 'Server updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating server: ' . $e->getMessage());
        }
    }

    public function destroy(Server $server)
    {
        abort_unless(auth()->user()->can('servers.delete'), 403);

        DB::beginTransaction();
        try {
            if ($server->credential) {
                $server->credential->delete();
            }
            $server->delete();

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'deleted',
                'subject_type' => Server::class,
                'subject_id'   => $server->id,
                'old_values'   => $server->toArray(),
            ]);

            DB::commit();
            return redirect()->route('servers.index')->with('success', 'Server deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting server: ' . $e->getMessage());
        }
    }
}
