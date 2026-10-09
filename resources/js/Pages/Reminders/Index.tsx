import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, MoreVertical, Edit, Trash2, Bell, Calendar, Clock, AlertTriangle } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import { useState } from 'react';

export default function Index({ reminders, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority || 'All');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('reminders.index'), { search, status: statusFilter, priority: priorityFilter }, { preserveState: true });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        router.get(route('reminders.index'), { search, status: newStatus, priority: priorityFilter }, { preserveState: true });
    };
    
    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value;
        setPriorityFilter(newPriority);
        router.get(route('reminders.index'), { search, status: statusFilter, priority: newPriority }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-7xl mx-auto gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Bell className="h-6 w-6 text-primary" />
                            Reminders
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage system notifications and scheduled reminders.</p>
                    </div>
                    <Link
                        href={route('reminders.create')}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Reminder
                    </Link>
                </div>
            }
        >
            <Head title="Reminders" />

            <div className="mx-auto max-w-7xl pb-10">
                <div className="bg-card rounded-xl border border-border shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border bg-muted/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="relative max-w-md w-full">
                            <div className="relative flex items-center w-full">
                                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search reminders..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                />
                                <button type="submit" className="sr-only">Search</button>
                            </div>
                        </form>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Status:</span>
                                <select
                                    value={statusFilter}
                                    onChange={handleStatusChange}
                                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-32"
                                >
                                    <option value="All">All</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Dismissed">Dismissed</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Priority:</span>
                                <select
                                    value={priorityFilter}
                                    onChange={handlePriorityChange}
                                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-32"
                                >
                                    <option value="All">All</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-h-[280px]">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Title & Type</th>
                                    <th className="px-6 py-3 font-medium">Client</th>
                                    <th className="px-6 py-3 font-medium">Assigned To</th>
                                    <th className="px-6 py-3 font-medium">Due Date</th>
                                    <th className="px-6 py-3 font-medium">Priority</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {reminders.data.length > 0 ? (
                                    reminders.data.map((reminder: any) => (
                                        <tr key={reminder.id} className="hover:bg-muted/10 transition-colors group">
                                            <td className="px-6 py-3.5 font-medium text-foreground">
                                                <div className="flex flex-col">
                                                    <span>{reminder.title}</span>
                                                    <span className="text-xs text-muted-foreground">{reminder.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                {reminder.client?.company_name || '-'}
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                {reminder.assigned_user?.name || '-'}
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {new Date(reminder.due_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                    reminder.priority === 'High' 
                                                        ? 'bg-red-50 text-red-700 border-red-200' 
                                                        : reminder.priority === 'Medium'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {reminder.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                    reminder.status === 'Completed' 
                                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                                        : reminder.status === 'Pending'
                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        : 'bg-muted text-muted-foreground border-input'
                                                }`}>
                                                    {reminder.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground group-hover:text-foreground">
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align="right" width="48">
                                                        <Dropdown.Link href={route('reminders.show', reminder.id)} className="flex items-center text-sm py-2">
                                                            <Bell className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('reminders.edit', reminder.id)} className="flex items-center text-sm py-2">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Dropdown.Link>
                                                        <div className="h-px bg-border my-1" />
                                                        <Dropdown.Link 
                                                            href={route('reminders.destroy', reminder.id)} 
                                                            method="delete" 
                                                            as="button"
                                                            className="flex items-center text-sm py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onSuccess={() => {}}
                                                            onClick={(e) => {
                                                                if (!confirm(`Are you sure you want to delete this reminder? This action cannot be undone.`)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Reminder
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Bell className="h-10 w-10 mb-3 opacity-20" />
                                                <p className="text-base font-medium text-foreground">No reminders found</p>
                                                <p className="text-sm mt-1 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                                                {search || statusFilter !== 'All' || priorityFilter !== 'All' ? (
                                                    <button 
                                                        onClick={() => { setSearch(''); setStatusFilter('All'); setPriorityFilter('All'); router.get(route('reminders.index')); }}
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                ) : (
                                                    <Link 
                                                        href={route('reminders.create')}
                                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add your first reminder
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {reminders.links && reminders.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-center sm:justify-end">
                            <div className="flex items-center gap-1">
                                {reminders.links.map((link: any, i: number) => (
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
