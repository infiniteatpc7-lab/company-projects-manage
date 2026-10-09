import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, MoreVertical, Edit, Trash2, FileText } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import { useState } from 'react';

export default function Index({ amcs, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('amc.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        router.get(route('amc.index'), { search, status: newStatus }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-7xl mx-auto gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Annual Maintenance Contracts (AMC)
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage maintenance contracts and renewals.</p>
                    </div>
                    <Link
                        href={route('amc.create')}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add AMC
                    </Link>
                </div>
            }
        >
            <Head title="AMCs" />

            <div className="mx-auto max-w-7xl pb-10">
                <div className="bg-card rounded-xl border border-border shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="relative max-w-md w-full">
                            <div className="relative flex items-center w-full">
                                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search AMCs or clients..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                />
                                <button type="submit" className="sr-only">Search</button>
                            </div>
                        </form>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium whitespace-nowrap">
                                <span>Filter Status:</span>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={handleFilterChange}
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full sm:w-36"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-h-[280px]">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Title</th>
                                    <th className="px-6 py-3 font-medium">Client / Project</th>
                                    <th className="px-6 py-3 font-medium">Amount & Cycle</th>
                                    <th className="px-6 py-3 font-medium">Next Due</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {amcs.data.length > 0 ? (
                                    amcs.data.map((amc: any) => (
                                        <tr key={amc.id} className="hover:bg-muted/10 transition-colors group">
                                            <td className="px-6 py-3.5 font-medium text-foreground">
                                                {amc.title}
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                <div className="flex flex-col text-xs leading-relaxed">
                                                    <span>{amc.client?.company_name}</span>
                                                    <span className="text-muted-foreground">{amc.project?.name || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                <div className="flex flex-col text-xs leading-relaxed">
                                                    <span className="font-semibold text-foreground">₹{parseFloat(amc.amount).toFixed(2)}</span>
                                                    <span className="text-muted-foreground">{amc.billing_cycle}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                {new Date(amc.next_due_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                    amc.status === 'Active' 
                                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                                        : amc.status === 'Cancelled'
                                                        ? 'bg-muted text-muted-foreground border-input'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {amc.status}
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
                                                        <Dropdown.Link href={route('amc.show', amc.id)} className="flex items-center text-sm py-2">
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('amc.edit', amc.id)} className="flex items-center text-sm py-2">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Dropdown.Link>
                                                        <div className="h-px bg-border my-1" />
                                                        <Dropdown.Link 
                                                            href={route('amc.destroy', amc.id)} 
                                                            method="delete" 
                                                            as="button"
                                                            className="flex items-center text-sm py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onSuccess={() => {}}
                                                            onClick={(e) => {
                                                                if (!confirm(`Are you sure you want to delete ${amc.title}? This action cannot be undone.`)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete AMC
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <FileText className="h-10 w-10 mb-3 opacity-20" />
                                                <p className="text-base font-medium text-foreground">No AMCs found</p>
                                                <p className="text-sm mt-1 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                                                {search || statusFilter !== 'All' ? (
                                                    <button 
                                                        onClick={() => { setSearch(''); setStatusFilter('All'); router.get(route('amc.index')); }}
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                ) : (
                                                    <Link 
                                                        href={route('amc.create')}
                                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 transition-colors"
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add your first AMC
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
                    {amcs.links && amcs.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-center sm:justify-end">
                            <div className="flex items-center gap-1">
                                {amcs.links.map((link: any, i: number) => (
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
