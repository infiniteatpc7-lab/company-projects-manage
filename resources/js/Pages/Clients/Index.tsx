import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';

export default function Index({ clients, filters, flash }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [visibleSuccess, setVisibleSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setVisibleSuccess(flash.success);
            const timer = setTimeout(() => {
                setVisibleSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        router.get(route('clients.index'), { search, status }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">Clients</h2>
                        <p className="text-sm text-foreground/60 mt-1">Manage your company's clients and contact details.</p>
                    </div>
                    <Link
                        href={route('clients.create')}
                        className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md bg-primary h-10 px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                    </Link>
                </div>
            }
        >
            <Head title="Clients" />

            <div className="mx-auto max-w-7xl">
                {visibleSuccess && (
                    <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200 transition-opacity duration-500 opacity-100">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{visibleSuccess}</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Search & Filter Bar */}
                <div className="mb-4">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div className="w-full sm:w-auto flex flex-1 sm:flex-none gap-3">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <button
                                type="submit"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 shrink-0"
                            >
                                Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* Clients Table */}
                <div className="rounded-lg border border-border bg-card shadow-sm">
                    <div className="w-full">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs uppercase bg-muted/40 border-b border-border text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Company Name</th>
                                    <th className="px-6 py-3 font-medium">Contact Person</th>
                                    <th className="px-6 py-3 font-medium">Email & Phone</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {clients.data.length > 0 ? (
                                    clients.data.map((client: any) => (
                                        <tr key={client.id} className="hover:bg-muted/10 transition-colors group">
                                            <td className="px-6 py-3.5 font-medium text-foreground">
                                                {client.company_name}
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                {client.contact_person}
                                            </td>
                                            <td className="px-6 py-3.5 text-foreground/80">
                                                <div className="flex flex-col text-xs leading-relaxed">
                                                    <span>{client.email}</span>
                                                    <span className="text-muted-foreground">{client.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                    client.status === 'Active' 
                                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                                        : 'bg-muted text-muted-foreground border-input'
                                                }`}>
                                                    {client.status}
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
                                                        <Dropdown.Link href={route('clients.show', client.id)} className="flex items-center text-sm py-2">
                                                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            View Details
                                                        </Dropdown.Link>
                                                        <Dropdown.Link href={route('clients.edit', client.id)} className="flex items-center text-sm py-2">
                                                            <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            Edit Client
                                                        </Dropdown.Link>
                                                        <div className="border-t border-border my-1"></div>
                                                        <Dropdown.Link 
                                                            href={route('clients.destroy', client.id)} 
                                                            method="delete" 
                                                            as="button"
                                                            onBefore={() => {
                                                                if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
                                                                    return false;
                                                                }
                                                            }}
                                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors text-left"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Client
                                                        </Dropdown.Link>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="h-8 w-8 mb-3 opacity-20" />
                                                <p>No clients found.</p>
                                                <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Placeholder */}
                {clients.links && clients.links.length > 3 && (
                    <div className="mt-5 flex justify-center sm:justify-end">
                        <div className="flex gap-1">
                            {clients.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`inline-flex items-center justify-center rounded-md h-9 px-3.5 py-2 text-sm font-medium border transition-colors ${
                                        link.active 
                                            ? 'bg-primary text-primary-foreground border-primary' 
                                            : 'bg-card text-foreground/80 border-input hover:bg-muted'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
