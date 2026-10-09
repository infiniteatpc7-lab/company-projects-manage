<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('clients.view'), 403);

        $query = Client::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($search, $like) {
                $q->where('company_name', $like, '%' . $search . '%')
                  ->orWhere('contact_person', $like, '%' . $search . '%')
                  ->orWhere('email', $like, '%' . $search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $clients = $query->orderBy('company_name')->paginate(10)->withQueryString();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('clients.create'), 403);
        return Inertia::render('Clients/Create');
    }

    public function store(StoreClientRequest $request)
    {
        abort_unless(auth()->user()->can('clients.create'), 403);

        $client = Client::create($request->validated());

        ActivityLog::create([
            'user_id'      => auth()->id(),
            'action'       => 'created',
            'subject_type' => Client::class,
            'subject_id'   => $client->id,
            'new_values'   => $client->toArray(),
            'ip_address'   => $request->ip(),
        ]);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function show(Client $client)
    {
        abort_unless(auth()->user()->can('clients.view'), 403);
        return Inertia::render('Clients/Show', ['client' => $client]);
    }

    public function edit(Client $client)
    {
        abort_unless(auth()->user()->can('clients.edit'), 403);
        return Inertia::render('Clients/Edit', ['client' => $client]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        abort_unless(auth()->user()->can('clients.edit'), 403);

        $oldValues = $client->toArray();
        $client->update($request->validated());

        ActivityLog::create([
            'user_id'      => auth()->id(),
            'action'       => 'updated',
            'subject_type' => Client::class,
            'subject_id'   => $client->id,
            'old_values'   => $oldValues,
            'new_values'   => $client->fresh()->toArray(),
            'ip_address'   => $request->ip(),
        ]);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    public function destroy(Request $request, Client $client)
    {
        abort_unless(auth()->user()->can('clients.delete'), 403);

        $oldValues = $client->toArray();
        $client->delete();

        ActivityLog::create([
            'user_id'      => auth()->id(),
            'action'       => 'deleted',
            'subject_type' => Client::class,
            'subject_id'   => $client->id,
            'old_values'   => $oldValues,
            'ip_address'   => $request->ip(),
        ]);

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }
}
