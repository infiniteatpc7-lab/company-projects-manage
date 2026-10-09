import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, AlignLeft, Calendar } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function Edit({ project, clients }: any) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: project.client_id || '',
        name: project.name || '',
        project_type: project.project_type || '',
        website_url: project.website_url || '',
        status: project.status || 'Active',
        start_date: project.start_date || '',
        deadline: project.deadline || '',
        notes: project.notes || '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        put(route('projects.update', project.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
                    <Link
                        href={route('projects.index')}
                        className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">Edit Project</h2>
                    </div>
                </div>
            }
        >
            <Head title="Edit Project" />

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
                                            onChange={(e) => setData('client_id', e.target.value)}
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
                                        <InputLabel htmlFor="name" value="Project Name *" />
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="E-commerce Redesign"
                                        />
                                        <InputError message={errors.name} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="project_type" value="Project Type" />
                                        <input
                                            id="project_type"
                                            type="text"
                                            value={data.project_type}
                                            onChange={(e) => setData('project_type', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="Web Development"
                                        />
                                        <InputError message={errors.project_type} className="mt-1.5" />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="website_url" value="Website URL" />
                                        <input
                                            id="website_url"
                                            type="url"
                                            value={data.website_url}
                                            onChange={(e) => setData('website_url', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="https://example.com"
                                        />
                                        <InputError message={errors.website_url} className="mt-1.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Timeline & Status */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Timeline & Status</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <InputLabel htmlFor="status" value="Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-1.5" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="start_date" value="Start Date" />
                                    <input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.start_date} className="mt-1.5" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="deadline" value="Deadline" />
                                    <input
                                        id="deadline"
                                        type="date"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.deadline} className="mt-1.5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information - Full Width */}
                    <div className="mt-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <AlignLeft className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Additional Notes</h3>
                        </div>
                        <div className="p-6">
                            <InputLabel htmlFor="notes" value="Notes" />
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                rows={4}
                            />
                            <InputError message={errors.notes} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                        <Link 
                            href={route('projects.index')} 
                            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update Project'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
