import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building2, AlignLeft, Trash2 } from 'lucide-react';

export default function Show({ client }: any) {
    const confirmDelete = () => {
        if (confirm(`Are you sure you want to delete ${client.company_name}? This action cannot be undone.`)) {
            router.delete(route('clients.destroy', client.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-5xl mx-auto gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('clients.index')}
                            className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold leading-tight text-foreground">{client.company_name}</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    client.status === 'Active' 
                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                        : 'bg-muted text-muted-foreground border-input'
                                }`}>
                                    {client.status}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/60 mt-0.5">Client Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={confirmDelete}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </button>
                        <Link
                            href={route('clients.edit', client.id)}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={client.company_name} />

            <div className="mx-auto max-w-5xl pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Company Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Company Name</dt>
                                        <dd className="mt-1.5 text-sm font-medium text-foreground">{client.company_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Contact Person</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">{client.contact_person}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <AlignLeft className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Notes</h3>
                            </div>
                            <div className="p-6">
                                {client.notes ? (
                                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{client.notes}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No notes provided for this client.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact & Address */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Contact Details</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </dt>
                                    <dd className="mt-1.5 text-sm">
                                        <a href={`mailto:${client.email}`} className="text-primary hover:underline font-medium">{client.email}</a>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </dt>
                                    <dd className="mt-1.5 text-sm text-foreground">{client.phone}</dd>
                                </div>
                                {client.whatsapp && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                                            </svg>
                                            WhatsApp
                                        </dt>
                                        <dd className="mt-1.5 text-sm text-foreground">{client.whatsapp}</dd>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Address</h3>
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-foreground/80 leading-relaxed space-y-1">
                                    {client.address && <p>{client.address}</p>}
                                    <p>{[client.city, client.state].filter(Boolean).join(', ')}</p>
                                    <p className="font-medium text-foreground pt-1">{client.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
