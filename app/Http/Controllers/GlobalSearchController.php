<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\Project;
use App\Models\Domain;
use App\Models\Server;
use App\Models\Amc;

class GlobalSearchController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('search.use'), 403);

        $query = $request->input('q');

        if (empty(trim($query))) {
            return response()->json([
                'clients'  => [],
                'projects' => [],
                'domains'  => [],
                'servers'  => [],
                'amcs'     => [],
            ]);
        }

        $user       = auth()->user();
        $searchTerm = '%' . strtolower($query) . '%';
        $operator   = config('database.default') === 'pgsql' ? 'ILIKE' : 'LIKE';

        // 1. Clients
        $clients = $user->can('clients.view')
            ? Client::where('company_name', $operator, $searchTerm)
                ->orWhere('contact_person', $operator, $searchTerm)
                ->orWhere('email', $operator, $searchTerm)
                ->orWhere('phone', $operator, $searchTerm)
                ->orWhere('whatsapp', $operator, $searchTerm)
                ->orWhere('city', $operator, $searchTerm)
                ->orWhere('state', $operator, $searchTerm)
                ->orWhere('country', $operator, $searchTerm)
                ->take(5)->get()
                ->map(fn($c) => [
                    'id'       => $c->id,
                    'title'    => $c->company_name,
                    'subtitle' => trim($c->contact_person . ($c->email ? " • {$c->email}" : '')),
                    'url'      => route('clients.show', $c->id),
                ])
            : collect();

        // 2. Projects
        $projects = $user->can('projects.view')
            ? Project::with('client:id,company_name')
                ->where('name', $operator, $searchTerm)
                ->orWhere('project_type', $operator, $searchTerm)
                ->orWhere('website_url', $operator, $searchTerm)
                ->orWhereHas('client', fn($q) => $q->where('company_name', $operator, $searchTerm))
                ->take(5)->get()
                ->map(fn($p) => [
                    'id'       => $p->id,
                    'title'    => $p->name,
                    'subtitle' => trim(($p->client ? $p->client->company_name : '-') . ' • ' . $p->status),
                    'url'      => route('projects.show', $p->id),
                ])
            : collect();

        // 3. Domains
        $domains = $user->can('domains.view')
            ? Domain::with('client:id,company_name')
                ->where('domain_name', $operator, $searchTerm)
                ->orWhere('registrar', $operator, $searchTerm)
                ->orWhereHas('client', fn($q) => $q->where('company_name', $operator, $searchTerm))
                ->take(5)->get()
                ->map(fn($d) => [
                    'id'       => $d->id,
                    'title'    => $d->domain_name,
                    'subtitle' => trim(($d->client ? $d->client->company_name : '-') . ($d->renewal_date ? ' • ' . date('M j, Y', strtotime($d->renewal_date)) : '')),
                    'url'      => route('domains.show', $d->id),
                ])
            : collect();

        // 4. Servers
        $servers = $user->can('servers.view')
            ? Server::with('client:id,company_name')
                ->where('name', $operator, $searchTerm)
                ->orWhere('provider', $operator, $searchTerm)
                ->orWhere('ip_address', $operator, $searchTerm)
                ->orWhere('plan', $operator, $searchTerm)
                ->orWhereHas('client', fn($q) => $q->where('company_name', $operator, $searchTerm))
                ->take(5)->get()
                ->map(fn($s) => [
                    'id'       => $s->id,
                    'title'    => $s->name,
                    'subtitle' => trim(($s->client ? $s->client->company_name : '-') . ' • ' . $s->provider),
                    'url'      => route('servers.show', $s->id),
                ])
            : collect();

        // 5. AMC
        $amcs = $user->can('amc.view')
            ? Amc::with('client:id,company_name')
                ->where('title', $operator, $searchTerm)
                ->orWhereHas('client', fn($q) => $q->where('company_name', $operator, $searchTerm))
                ->take(5)->get()
                ->map(fn($a) => [
                    'id'       => $a->id,
                    'title'    => $a->title,
                    'subtitle' => trim(($a->client ? $a->client->company_name : '-') . ($a->amount ? ' • ₹' . number_format($a->amount, 2) : '')),
                    'url'      => route('amc.show', $a->id),
                ])
            : collect();

        return response()->json([
            'clients'  => $clients,
            'projects' => $projects,
            'domains'  => $domains,
            'servers'  => $servers,
            'amcs'     => $amcs,
        ]);
    }
}
