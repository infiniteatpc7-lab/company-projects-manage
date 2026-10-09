import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, AlignLeft, Trash2, Bell, Calendar, UserIcon } from 'lucide-react';

export default function Show({ reminder }: any) {
    const confirmDelete = () => {
        if (confirm('Are you sure you want to delete this reminder? This action cannot be undone.')) {
            router.delete(route('reminders.destroy', reminder.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-5xl mx-auto gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('reminders.index')}
                            className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold leading-tight text-foreground">{reminder.title}</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    reminder.status === 'Completed' 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : reminder.status === 'Pending'
                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        : 'bg-muted text-muted-foreground border-input'
                                }`}>
                                    {reminder.status}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/60 mt-0.5">Reminder Details</p>
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
                            href={route('reminders.edit', reminder.id)}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Reminder
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={reminder.title} />

            <div className="mx-auto max-w-5xl pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Reminder Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                                        <dd className="mt-1.5 text-sm font-medium text-foreground">{reminder.type}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                                        <dd className="mt-1.5">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                reminder.priority === 'High' 
                                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                                    : reminder.priority === 'Medium'
                                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                {reminder.priority}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Client</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">
                                            {reminder.client ? (
                                                <Link href={route('clients.show', reminder.client.id)} className="text-primary hover:underline">
                                                    {reminder.client.company_name}
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground italic">None / General</span>
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Assigned To</dt>
                                        <dd className="mt-1.5 text-sm text-foreground">
                                            {reminder.assigned_user ? (
                                                <div className="flex items-center gap-1.5">
                                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                    {reminder.assigned_user.name}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Unassigned</span>
                                            )}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <AlignLeft className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Description</h3>
                            </div>
                            <div className="p-6">
                                {reminder.description ? (
                                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{reminder.description}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No details provided.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Timeline */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Schedule</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Due Date</dt>
                                    <dd className="mt-1.5 text-lg font-semibold text-foreground">
                                        {new Date(reminder.due_date).toLocaleDateString()}
                                    </dd>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <dt className="text-sm font-medium text-muted-foreground">Reminder Date</dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">
                                        {new Date(reminder.reminder_date).toLocaleDateString()}
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
