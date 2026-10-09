import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Activity, Eye, Filter, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function Index({ logs, filters, users, modules, actions }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [actionFilter, setActionFilter] = useState(filters.action || '');
    const [moduleFilter, setModuleFilter] = useState(filters.module || '');
    const [userFilter, setUserFilter] = useState(filters.user_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(route('activity-logs.index'), { 
            search, 
            action: actionFilter, 
            module: moduleFilter,
            user_id: userFilter,
            date_from: dateFrom,
            date_to: dateTo
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setActionFilter('');
        setModuleFilter('');
        setUserFilter('');
        setDateFrom('');
        setDateTo('');
        router.get(route('activity-logs.index'));
    };

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-7xl mx-auto gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Activity className="h-6 w-6 text-primary" />
                            Activity Logs
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Audit trail of all system activities.</p>
                    </div>
                </div>
            }
        >
            <Head title="Activity Logs" />

            <div className="mx-auto max-w-7xl pb-10">
                <div className="bg-card rounded-xl border border-border shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border bg-muted/20 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <form onSubmit={handleSearch} className="relative max-w-md w-full">
                                <div className="relative flex items-center w-full">
                                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <button type="submit" className="sr-only">Search</button>
                                </div>
                            </form>
                            
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                    showFilters || actionFilter || moduleFilter || userFilter || dateFrom || dateTo
                                        ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
                                        : 'bg-background border-input text-foreground hover:bg-muted'
                                }`}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters {(actionFilter || moduleFilter || userFilter || dateFrom || dateTo) && '(Active)'}
                            </button>
                        </div>

                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Action</label>
                                    <select
                                        value={actionFilter}
                                        onChange={(e) => { setActionFilter(e.target.value); setTimeout(applyFilters, 0); }}
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">All Actions</option>
                                        {actions.map((action: string) => (
                                            <option key={action} value={action}>{action}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Module</label>
                                    <select
                                        value={moduleFilter}
                                        onChange={(e) => { setModuleFilter(e.target.value); setTimeout(applyFilters, 0); }}
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">All Modules</option>
                                        {modules.map((mod: string) => (
                                            <option key={mod} value={mod}>{mod}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">User</label>
                                    <select
                                        value={userFilter}
                                        onChange={(e) => { setUserFilter(e.target.value); setTimeout(applyFilters, 0); }}
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">All Users</option>
                                        {users.map((user: any) => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From Date</label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => { setDateFrom(e.target.value); }}
                                            onBlur={applyFilters}
                                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To Date</label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => { setDateTo(e.target.value); }}
                                            onBlur={applyFilters}
                                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                                
                                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-h-[280px]">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Date & Time</th>
                                    <th className="px-6 py-3 font-medium">User</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                    <th className="px-6 py-3 font-medium">Module (Type)</th>
                                    <th className="px-6 py-3 font-medium">Record ID</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {new Date(log.created_at).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 font-medium text-foreground">
                                                {log.user?.name || 'System / Unknown'}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                {log.subject_type.split('\\').pop()}
                                            </td>
                                            <td className="px-6 py-3.5 text-muted-foreground">
                                                #{log.subject_id}
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <Link 
                                                    href={route('activity-logs.show', log.id)}
                                                    className="inline-flex items-center justify-center rounded-md h-8 px-3 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                >
                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Activity className="h-10 w-10 mb-3 opacity-20" />
                                                <p className="text-base font-medium text-foreground">No activity logs found</p>
                                                <p className="text-sm mt-1 mb-4">Try adjusting your filters to find what you're looking for.</p>
                                                {(search || actionFilter || moduleFilter || userFilter || dateFrom || dateTo) && (
                                                    <button 
                                                        onClick={clearFilters}
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {logs.links && logs.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-center sm:justify-end">
                            <div className="flex items-center gap-1">
                                {logs.links.map((link: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={link.url || ''}
                                        className={`inline-flex items-center justify-center h-8 px-3 text-sm rounded-md transition-colors ${
                                            link.active 
                                                ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                                                : link.url 
                                                    ? 'text-muted-foreground hover:bg-muted hover:text-foreground' 
                                                    : 'text-muted-foreground/40 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveState
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
