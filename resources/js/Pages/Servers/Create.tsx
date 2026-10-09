import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, MapPin, AlignLeft, Calendar, ShieldAlert, Server } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function Create({ clients, projects }: any) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        project_id: '',
        name: '',
        provider: '',
        managed_by: 'Company',
        ip_address: '',
        plan: '',
        purchase_date: '',
        renewal_date: '',
        renewal_cost: '',
        status: 'Active',
        notes: '',
        username: '',
        email: '',
        password: '',
        credential_notes: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('servers.store'));
    };

    // Filter projects based on selected client
    const filteredProjects = projects.filter((p: any) => p.client_id == data.client_id);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
                    <Link
                        href={route('servers.index')}
                        className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">Add New Server</h2>
                    </div>
                </div>
            }
        >
            <Head title="Add Server" />

            <div className="mx-auto max-w-7xl pb-10">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Basic Information */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Server className="h-5 w-5 text-muted-foreground" />
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
                                            <option value="">None / Independent Server</option>
                                            {filteredProjects.map((project: any) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.project_id} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="name" value="Server Name *" />
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="Production Server, web-01, etc."
                                        />
                                        <InputError message={errors.name} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="provider" value="Provider" />
                                        <input
                                            id="provider"
                                            type="text"
                                            value={data.provider}
                                            onChange={(e) => setData('provider', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="AWS, DigitalOcean, etc."
                                        />
                                        <InputError message={errors.provider} className="mt-1.5" />
                                    </div>
                                    
                                    <div>
                                        <InputLabel htmlFor="ip_address" value="IP Address" />
                                        <input
                                            id="ip_address"
                                            type="text"
                                            value={data.ip_address}
                                            onChange={(e) => setData('ip_address', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="192.168.1.1"
                                        />
                                        <InputError message={errors.ip_address} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="plan" value="Plan / Specifications" />
                                        <input
                                            id="plan"
                                            type="text"
                                            value={data.plan}
                                            onChange={(e) => setData('plan', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="4GB RAM, 2 vCPUs, etc."
                                        />
                                        <InputError message={errors.plan} className="mt-1.5" />
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
                            </div>
                        </div>
                    </div>
                    
                    {/* Credentials Section - Full Width */}
                    <div className="mt-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Server Credentials (Optional)</h3>
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
                                        placeholder="root, admin, etc."
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
                                        placeholder="SSH key details, FTP details, port numbers, etc."
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
                            <h3 className="text-base font-medium text-foreground">Server Notes</h3>
                        </div>
                        <div className="p-6">
                            <InputLabel htmlFor="notes" value="Notes" />
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                rows={4}
                                placeholder="General notes about this server..."
                            />
                            <InputError message={errors.notes} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                        <Link 
                            href={route('servers.index')} 
                            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Server'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
