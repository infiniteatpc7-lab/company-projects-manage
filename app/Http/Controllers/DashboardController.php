<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use App\Models\Client;
use App\Models\Project;
use App\Models\Domain;
use App\Models\Server;
use App\Models\Amc;
use App\Models\AmcPayment;
use App\Models\ActivityLog;

class DashboardController extends Controller
{
    public function index()
    {
        $dashboardData = Cache::remember('admin_dashboard_payload', 30, function () {
            $now = Carbon::now();
            $next30Days = Carbon::now()->addDays(30);

            // KPI Counts
            $kpi = [
                'total_clients'  => Client::count(),
                'total_projects' => Project::count(),
                'total_domains'  => Domain::count(),
                'total_servers'  => Server::count(),
            ];

            // Renewal Statistics
            $renewals = [
                'domains_expiring_30_days'   => Domain::whereBetween('renewal_date', [$now->toDateString(), $next30Days->toDateString()])->count(),
                'servers_expiring_30_days'   => Server::whereBetween('renewal_date', [$now->toDateString(), $next30Days->toDateString()])->count(),
                'expired_domains'            => Domain::whereDate('renewal_date', '<', $now->toDateString())->where('status', '!=', 'Expired')->count(),
                'expired_servers'            => Server::whereDate('renewal_date', '<', $now->toDateString())->where('status', '!=', 'Expired')->count(),
                'domains_expiring_this_month'=> Domain::whereMonth('renewal_date', $now->month)->whereYear('renewal_date', $now->year)->count(),
                'servers_expiring_this_month'=> Server::whereMonth('renewal_date', $now->month)->whereYear('renewal_date', $now->year)->count(),
            ];

            // AMC Statistics
            $amcStats = [
                'due_this_month' => AmcPayment::whereMonth('due_date', $now->month)->whereYear('due_date', $now->year)->sum('amount') ?: 0,
                'collected_this_month' => AmcPayment::where('status', 'Collected')
                    ->whereMonth('collected_date', $now->month)
                    ->whereYear('collected_date', $now->year)
                    ->sum('amount') ?: 0,
            ];

            // Upcoming Renewals List (Domains + Servers next 30 days)
            $upcomingDomains = Domain::with('client')
                ->whereBetween('renewal_date', [$now->toDateString(), $next30Days->toDateString()])
                ->get()
                ->map(function ($domain) {
                    return [
                        'id' => $domain->id,
                        'type' => 'Domain',
                        'name' => $domain->domain_name,
                        'client_name' => $domain->client ? $domain->client->company_name : '-',
                        'client_id' => $domain->client_id,
                        'renewal_date' => $domain->renewal_date,
                        'amount' => $domain->renewal_cost,
                    ];
                });

            $upcomingServers = Server::with('client')
                ->whereBetween('renewal_date', [$now->toDateString(), $next30Days->toDateString()])
                ->get()
                ->map(function ($server) {
                    return [
                        'id' => $server->id,
                        'type' => 'Server',
                        'name' => $server->server_name,
                        'client_name' => $server->client ? $server->client->company_name : '-',
                        'client_id' => $server->client_id,
                        'renewal_date' => $server->renewal_date,
                        'amount' => $server->renewal_cost,
                    ];
                });

            $upcomingRenewalsList = collect($upcomingDomains)->merge($upcomingServers)
                ->sortBy('renewal_date')
                ->take(10)
                ->values();

            // AMC Overview (due this month)
            $amcOverview = AmcPayment::with(['amc.client'])
                ->whereMonth('due_date', $now->month)
                ->whereYear('due_date', $now->year)
                ->orderBy('due_date', 'asc')
                ->take(10)
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'amc_id' => $payment->amc_id,
                        'title' => $payment->amc ? $payment->amc->title : '-',
                        'client_name' => $payment->amc && $payment->amc->client ? $payment->amc->client->company_name : '-',
                        'client_id' => $payment->amc ? $payment->amc->client_id : null,
                        'due_date' => $payment->due_date,
                        'amount' => $payment->amount,
                        'status' => $payment->status,
                    ];
                });

            // Recent Activity
            $recentActivity = ActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            return [
                'stats' => [
                    'kpi' => $kpi,
                    'renewals' => $renewals,
                    'amc' => $amcStats,
                ],
                'upcomingRenewals' => $upcomingRenewalsList,
                'amcOverview' => $amcOverview,
                'recentActivity' => $recentActivity,
            ];
        });

        return Inertia::render('Dashboard', $dashboardData);
    }
}
