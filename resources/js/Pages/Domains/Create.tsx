import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, MapPin, AlignLeft, Calendar, ShieldAlert } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function Create({ clients, projects }: any) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        project_id: '',
        domain_name: '',
        managed_by: 'Company',
        registrar: '',
        purchase_date: '',
        renewal_date: '',
        renewal_cost: '',
        auto_renew: true,
        status: 'Active',
        notes: '',
        username: '',
        email: '',
        password: '',
        credential_notes: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('domains.store'));
    };

    // Filter projects based on selected client
    const filteredProjects = projects.filter((p: any) => p.client_id == data.client_id);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
                    <Link
                        href={route('domains.index')}
                        className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">Add New Domain</h2>
                    </div>
                </div>
            }
        >
            <Head title="Add Domain" />

            <div className="mx-auto max-w-7xl pb-10">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Basic Information */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Basic Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="client_id" value="Client *" />
                                        <select
                                            id="client_id"
                                            value={data.client_id}
                                            onChange={(e) => {
                                                setData('client_id', e.target.value);
                                                setData('project_id', ''); // Reset project when client changes
                                            }}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="">Select a client...</option>
                                            {clients.map((client: any) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.company_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.client_id} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="project_id" value="Project" />
                                        <select
                                            id="project_id"
                                            value={data.project_id}
                                            onChange={(e) => setData('project_id', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                                            disabled={!data.client_id}
                                        >
                                            <option value="">None / Independent Domain</option>
                                            {filteredProjects.map((project: any) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.project_id} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="domain_name" value="Domain Name *" />
                                        <input
                                            id="domain_name"
                                            type="text"
                                            value={data.domain_name}
                                            onChange={(e) => setData('domain_name', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="example.com"
                                        />
                                        <InputError message={errors.domain_name} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="managed_by" value="Managed By *" />
                                        <select
                                            id="managed_by"
                                            value={data.managed_by}
                                            onChange={(e) => setData('managed_by', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Company">Company</option>
                                            <option value="Client">Client</option>
                                        </select>
                                        <InputError message={errors.managed_by} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status *" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Expired">Expired</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-1.5" />
                                    </div>
                                    
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="registrar" value="Registrar" />
                                        <input
                                            id="registrar"
                                            type="text"
                                            value={data.registrar}
                                            onChange={(e) => setData('registrar', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="GoDaddy, Namecheap, etc."
                                        />
                                        <InputError message={errors.registrar} className="mt-1.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Timeline & Dates */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Timeline & Renewal</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                
                                <div>
                                    <InputLabel htmlFor="purchase_date" value="Purchase Date" />
                                    <input
                                        id="purchase_date"
                                        type="date"
                                        value={data.purchase_date}
                                        onChange={(e) => setData('purchase_date', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.purchase_date} className="mt-1.5" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="renewal_date" value="Renewal Date" />
                                    <input
                                        id="renewal_date"
                                        type="date"
                                        value={data.renewal_date}
                                        onChange={(e) => setData('renewal_date', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.renewal_date} className="mt-1.5" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="renewal_cost" value="Renewal Cost (₹)" />
                                    <input
                                        id="renewal_cost"
                                        type="number"
                                        step="0.01"
                                        value={data.renewal_cost}
                                        onChange={(e) => setData('renewal_cost', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.renewal_cost} className="mt-1.5" />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        id="auto_renew"
                                        type="checkbox"
                                        checked={data.auto_renew}
                                        onChange={(e) => setData('auto_renew', e.target.checked)}
                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary bg-transparent"
                                    />
                                    <InputLabel htmlFor="auto_renew" value="Auto Renew Enabled" className="!mb-0 cursor-pointer" />
                                    <InputError message={errors.auto_renew} className="mt-1.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Credentials Section - Full Width */}
                    <div className="mt-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Domain Credentials (Optional)</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <InputLabel htmlFor="username" value="Username" />
                                    <input
                                        id="username"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        placeholder="Admin username"
                                    />
                                    <InputError message={errors.username} className="mt-1.5" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        placeholder="admin@example.com"
                                    />
                                    <InputError message={errors.email} className="mt-1.5" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="password" value="Password" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                        autoComplete="new-password"
                                    />
                                    <InputError message={errors.password} className="mt-1.5" />
                                    <p className="text-xs text-muted-foreground mt-1.5">Password will be securely encrypted.</p>
                                </div>
                                
                                <div className="md:col-span-3">
                                    <InputLabel htmlFor="credential_notes" value="Credential Notes" />
                                    <textarea
                                        id="credential_notes"
                                        value={data.credential_notes}
                                        onChange={(e) => setData('credential_notes', e.target.value)}
                                        className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        rows={2}
                                        placeholder="Nameservers, FTP details, etc."
                                    />
                                    <InputError message={errors.credential_notes} className="mt-1.5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information - Full Width */}
                    <div className="mt-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <AlignLeft className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Domain Notes</h3>
                        </div>
                        <div className="p-6">
                            <InputLabel htmlFor="notes" value="Notes" />
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                rows={4}
                                placeholder="General notes about this domain..."
                            />
                            <InputError message={errors.notes} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                        <Link 
                            href={route('domains.index')} 
                            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Domain'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
