import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, FolderKanban, Globe, Server, AlertCircle, FileText, Activity, Calendar, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function Dashboard({ stats, upcomingRenewals, amcOverview, recentActivity }: any) {
    const { kpi, renewals, amc } = stats;

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created': return 'bg-green-50 text-green-700 border-green-200';
            case 'updated': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'deleted': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-muted text-muted-foreground border-input';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">Dashboard</h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="mb-6">
                <p className="text-sm text-foreground/70">Overview of your company operations</p>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Clients */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-foreground/70">Clients</h3>
                            <Users className="h-5 w-5 text-foreground/40" />
                        </div>
                        <div className="flex items-baseline">
                            <p className="text-3xl font-bold text-foreground">{kpi.total_clients}</p>
                        </div>
                        <p className="mt-1 text-xs text-foreground/50">Total active clients</p>
                    </div>
                    <div className="bg-muted/30 px-6 py-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-foreground/60">
                            <span>AMC Due: <span className="font-semibold text-foreground">₹{parseFloat(amc.due_this_month).toFixed(2)}</span></span>
                            <span>Collected: <span className="font-semibold text-green-600">₹{parseFloat(amc.collected_this_month).toFixed(2)}</span></span>
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-foreground/70">Projects</h3>
                            <FolderKanban className="h-5 w-5 text-foreground/40" />
                        </div>
                        <div className="flex items-baseline">
                            <p className="text-3xl font-bold text-foreground">{kpi.total_projects}</p>
                        </div>
                        <p className="mt-1 text-xs text-foreground/50">Active projects</p>
                    </div>
                    <div className="bg-muted/30 px-6 py-3 border-t border-border flex items-center gap-1.5 text-xs text-foreground/60">
                        <FolderKanban className="h-3.5 w-3.5" /> All ongoing tasks
                    </div>
                </div>

                {/* Domains */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-foreground/70">Domains</h3>
                            <Globe className="h-5 w-5 text-foreground/40" />
                        </div>
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-bold text-foreground">{kpi.total_domains}</p>
                            {renewals.expired_domains > 0 && (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                    {renewals.expired_domains} expired
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-foreground/50">Managed domains</p>
                    </div>
                    <div className="bg-muted/30 px-6 py-3 border-t border-border">
                        <div className="flex flex-col gap-1 text-xs text-foreground/60">
                            <div className="flex justify-between">
                                <span>Expiring in 30 days:</span>
                                <span className="font-medium text-foreground">{renewals.domains_expiring_30_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expiring this month:</span>
                                <span className="font-medium text-foreground">{renewals.domains_expiring_this_month}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Servers */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm flex flex-col">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-foreground/70">Servers</h3>
                            <Server className="h-5 w-5 text-foreground/40" />
                        </div>
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-bold text-foreground">{kpi.total_servers}</p>
                            {renewals.expired_servers > 0 && (
                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                    {renewals.expired_servers} expired
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-foreground/50">Managed servers</p>
                    </div>
                    <div className="bg-muted/30 px-6 py-3 border-t border-border">
                        <div className="flex flex-col gap-1 text-xs text-foreground/60">
                            <div className="flex justify-between">
                                <span>Expiring in 30 days:</span>
                                <span className="font-medium text-foreground">{renewals.servers_expiring_30_days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Expiring this month:</span>
                                <span className="font-medium text-foreground">{renewals.servers_expiring_this_month}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {/* Upcoming Renewals */}
                <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden h-[400px]">
                    <div className="border-b border-border p-4 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-accent" />
                                <h3 className="text-base font-semibold text-foreground">Upcoming Renewals (30 Days)</h3>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {upcomingRenewals.length > 0 ? (
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Type / Name</th>
                                        <th className="px-4 py-3 font-medium">Client</th>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {upcomingRenewals.map((renewal: any, i: number) => (
                                        <tr key={`${renewal.type}-${renewal.id}-${i}`} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{renewal.name}</span>
                                                    <span className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                                                        {renewal.type === 'Domain' ? <Globe className="h-3 w-3" /> : <Server className="h-3 w-3" />}
                                                        {renewal.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-foreground/80 text-xs">
                                                {renewal.client_name}
                                            </td>
                                            <td className="px-4 py-3 text-foreground/80 text-xs">
                                                <div className="flex items-center gap-1 text-orange-600 font-medium">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(renewal.renewal_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                ₹{parseFloat(renewal.amount || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                <ShieldCheck className="mb-4 h-12 w-12 text-green-500/30" />
                                <h4 className="text-base font-medium text-foreground">All clear!</h4>
                                <p className="mt-1 text-sm text-muted-foreground">No domains or servers expiring in the next 30 days.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* AMC Overview */}
                <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden h-[400px]">
                    <div className="border-b border-border p-4 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="text-base font-semibold text-foreground">AMC Due This Month</h3>
                            </div>
                            <Link href={route('amc.index')} className="text-xs text-primary hover:underline font-medium">
                                View all AMC
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {amcOverview.length > 0 ? (
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">AMC</th>
                                        <th className="px-4 py-3 font-medium">Due Date</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                        <th className="px-4 py-3 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {amcOverview.map((amcPay: any) => (
                                        <tr key={amcPay.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground truncate max-w-[150px]">{amcPay.title}</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{amcPay.client_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-foreground/80 text-xs">
                                                {new Date(amcPay.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-foreground">
                                                ₹{parseFloat(amcPay.amount).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase font-bold border ${
                                                    amcPay.status === 'Collected' 
                                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                                        : amcPay.status === 'Pending'
                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {amcPay.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                <FileText className="mb-4 h-10 w-10 text-muted-foreground/20" />
                                <h4 className="text-sm font-medium text-foreground">No AMC payments due</h4>
                                <p className="mt-1 text-sm text-muted-foreground">There are no AMC payments scheduled for this month.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 gap-8">
                {/* Recent Activity */}
                <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="border-b border-border p-4 bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-foreground/60" />
                                <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
                            </div>
                            <Link href={route('activity-logs.index')} className="text-xs text-primary hover:underline font-medium flex items-center">
                                View all logs <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        {recentActivity.length > 0 ? (
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Action</th>
                                        <th className="px-6 py-3 font-medium">Module</th>
                                        <th className="px-6 py-3 font-medium text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentActivity.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-muted/10 transition-colors group">
                                            <td className="px-6 py-3.5 font-medium text-foreground">
                                                {log.user?.name || 'System'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                {log.subject_type.split('\\').pop()} <span className="text-muted-foreground text-xs ml-1">#{log.subject_id}</span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right text-muted-foreground flex items-center justify-end gap-3">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(log.created_at).toLocaleString(undefined, {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                                <Link 
                                                    href={route('activity-logs.show', log.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:underline text-xs font-medium"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <Activity className="mb-4 h-8 w-8 text-foreground/20" />
                                <h4 className="text-sm font-medium text-foreground">No recent activity</h4>
                                <p className="mt-1 text-sm text-muted-foreground">User actions and system events will be logged here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
