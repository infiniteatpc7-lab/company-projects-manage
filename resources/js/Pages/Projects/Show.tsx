import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, AlignLeft, Trash2, Globe, Calendar, Building2, ExternalLink } from 'lucide-react';

export default function Show({ project }: any) {
    const confirmDelete = () => {
        if (confirm(`Are you sure you want to delete ${project.name}? This action cannot be undone.`)) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-5xl mx-auto gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('projects.index')}
                            className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold leading-tight text-foreground">{project.name}</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    project.status === 'Active' 
                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                        : project.status === 'Completed'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-muted text-muted-foreground border-input'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/60 mt-0.5">Project Details</p>
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
                            href={route('projects.edit', project.id)}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="mx-auto max-w-5xl pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Project Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Project Name</dt>
                                        <dd className="mt-1.5 text-sm font-medium text-foreground">{project.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Client</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">
                                            {project.client ? (
                                                <Link href={route('clients.show', project.client.id)} className="text-primary hover:underline">
                                                    {project.client.company_name}
                                                </Link>
                                            ) : (
                                                'Unknown Client'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Project Type</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">{project.project_type || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Website URL</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">
                                            {project.website_url ? (
                                                <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                                    {project.website_url}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </dd>
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
                                {project.notes ? (
                                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{project.notes}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No notes provided for this project.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Timeline */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Timeline</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Start Date
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Deadline
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}
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
