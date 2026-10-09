import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, AlignLeft, Trash2, Globe, Calendar, Building2, ShieldAlert, Key } from 'lucide-react';
import { useState } from 'react';

export default function Show({ domain }: any) {
    const [showPassword, setShowPassword] = useState(false);

    const confirmDelete = () => {
        if (confirm(`Are you sure you want to delete ${domain.domain_name}? This action cannot be undone.`)) {
            router.delete(route('domains.destroy', domain.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-5xl mx-auto gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('domains.index')}
                            className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold leading-tight text-foreground">{domain.domain_name}</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    domain.status === 'Active' 
                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                        : domain.status === 'Expired'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-muted text-muted-foreground border-input'
                                }`}>
                                    {domain.status}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/60 mt-0.5">Domain Details</p>
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
                            href={route('domains.edit', domain.id)}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Domain
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={domain.domain_name} />

            <div className="mx-auto max-w-5xl pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Main Info & Credentials */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Domain Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Client</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">
                                            {domain.client ? (
                                                <Link href={route('clients.show', domain.client.id)} className="text-primary hover:underline">
                                                    {domain.client.company_name}
                                                </Link>
                                            ) : (
                                                'Unknown Client'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Project</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">
                                            {domain.project ? (
                                                <Link href={route('projects.show', domain.project.id)} className="text-primary hover:underline">
                                                    {domain.project.name}
                                                </Link>
                                            ) : (
                                                '-'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Managed By</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">{domain.managed_by}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Registrar</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">{domain.registrar || '-'}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {domain.credential && (
                            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                                <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="text-base font-medium text-foreground">Credentials</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Username</dt>
                                            <dd className="mt-1.5 text-sm font-mono text-foreground">{domain.credential.username || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                                            <dd className="mt-1.5 text-sm text-foreground">{domain.credential.email || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Password</dt>
                                            <dd className="mt-1.5 text-sm">
                                                {domain.credential.decrypted_password ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs select-all">
                                                            {showPassword ? domain.credential.decrypted_password : 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'}
                                                        </span>
                                                        <button 
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="text-xs text-primary hover:underline"
                                                        >
                                                            {showPassword ? 'Hide' : 'Reveal'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-muted-foreground">Credential Notes</dt>
                                            <dd className="mt-1.5 text-sm text-foreground/80 whitespace-pre-line">{domain.credential.notes || '-'}</dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <AlignLeft className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Domain Notes</h3>
                            </div>
                            <div className="p-6">
                                {domain.notes ? (
                                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{domain.notes}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No notes provided for this domain.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Timeline */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Timeline & Renewal</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Purchase Date
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                                        {domain.purchase_date ? new Date(domain.purchase_date).toLocaleDateString() : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Renewal Date
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                                        {domain.renewal_date ? new Date(domain.renewal_date).toLocaleDateString() : '-'}
                                    </dd>
                                </div>
                                <div className="pt-2 border-t border-border">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        Renewal Cost
                                    </dt>
                                    <dd className="mt-1.5 text-lg font-semibold text-foreground">
                                        {domain.renewal_cost ? `₹${parseFloat(domain.renewal_cost).toFixed(2)}` : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        Auto Renew
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                                        {domain.auto_renew ? (
                                            <span className="text-green-600">Enabled</span>
                                        ) : (
                                            <span className="text-muted-foreground">Disabled</span>
                                        )}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
