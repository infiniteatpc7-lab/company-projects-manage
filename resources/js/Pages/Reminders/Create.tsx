import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Bell, AlignLeft, Calendar, UserIcon, AlertTriangle } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function Create({ clients, users }: any) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        type: 'Domain Renewal',
        title: '',
        description: '',
        due_date: '',
        reminder_date: '',
        status: 'Pending',
        priority: 'Medium',
        assigned_to: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('reminders.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
                    <Link
                        href={route('reminders.index')}
                        className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-foreground">Add New Reminder</h2>
                    </div>
                </div>
            }
        >
            <Head title="Add Reminder" />

            <div className="mx-auto max-w-7xl pb-10">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Basic Information */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Basic Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                                    <div className="sm:col-span-2">
                                        <InputLabel htmlFor="title" value="Reminder Title *" />
                                        <input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                            placeholder="Renew example.com domain..."
                                        />
                                        <InputError message={errors.title} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="type" value="Reminder Type *" />
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Domain Renewal">Domain Renewal</option>
                                            <option value="Server Renewal">Server Renewal</option>
                                            <option value="AMC Due">AMC Due</option>
                                            <option value="General">General</option>
                                        </select>
                                        <InputError message={errors.type} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="client_id" value="Client (Optional)" />
                                        <select
                                            id="client_id"
                                            value={data.client_id}
                                            onChange={(e) => setData('client_id', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="">None / General Reminder</option>
                                            {clients.map((client: any) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.company_name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.client_id} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="priority" value="Priority *" />
                                        <select
                                            id="priority"
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                        <InputError message={errors.priority} className="mt-1.5" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status *" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Dismissed">Dismissed</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-1.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Timing & Assignment */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">Schedule & Assignment</h3>
                            </div>
                            <div className="p-6 space-y-5">
                                
                                <div>
                                    <InputLabel htmlFor="due_date" value="Due Date *" />
                                    <input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.due_date} className="mt-1.5" />
                                    <p className="text-xs text-muted-foreground mt-1.5">The actual deadline for the task.</p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="reminder_date" value="Reminder Date *" />
                                    <input
                                        id="reminder_date"
                                        type="date"
                                        value={data.reminder_date}
                                        onChange={(e) => setData('reminder_date', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.reminder_date} className="mt-1.5" />
                                    <p className="text-xs text-muted-foreground mt-1.5">When you want to be reminded (must be on or before Due Date).</p>
                                </div>
                                
                                <div className="pt-2 border-t border-border">
                                    <InputLabel htmlFor="assigned_to" value="Assign To (Optional)" />
                                    <select
                                        id="assigned_to"
                                        value={data.assigned_to}
                                        onChange={(e) => setData('assigned_to', e.target.value)}
                                        className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user: any) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.assigned_to} className="mt-1.5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information - Full Width */}
                    <div className="mt-6 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <AlignLeft className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Description</h3>
                        </div>
                        <div className="p-6">
                            <InputLabel htmlFor="description" value="Details" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                rows={4}
                                placeholder="Any additional information, steps, or context for this reminder..."
                            />
                            <InputError message={errors.description} className="mt-1.5" />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
                        <Link 
                            href={route('reminders.index')} 
                            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Reminder'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
