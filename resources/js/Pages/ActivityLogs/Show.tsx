import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Activity, UserIcon, Calendar, Info, Shield, Hash, Server } from 'lucide-react';

export default function Show({ log }: any) {
    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created': return 'bg-green-50 text-green-700 border-green-200';
            case 'updated': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'deleted': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-muted text-muted-foreground border-input';
        }
    };

    const formatJson = (data: any) => {
        if (!data) return 'None';
        return JSON.stringify(data, null, 2);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4 max-w-5xl mx-auto w-full">
                    <Link
                        href={route('activity-logs.index')}
                        className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold leading-tight text-foreground">Activity Log Details</h2>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border capitalize ${getActionColor(log.action)}`}>
                                {log.action}
                            </span>
                        </div>
                        <p className="text-sm text-foreground/60 mt-0.5">Log ID: #{log.id}</p>
                    </div>
                </div>
            }
        >
            <Head title={`Activity Log #${log.id}`} />

            <div className="mx-auto max-w-5xl pb-10">
                <div className="grid grid-cols-1 gap-6">
                    {/* Meta Information */}
                    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                            <Info className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-base font-medium text-foreground">Audit Meta Information</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                        <UserIcon className="h-4 w-4" /> User
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">{log.user?.name || 'System'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                        <Activity className="h-4 w-4" /> Module (Type)
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">{log.subject_type.split('\\').pop()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                        <Hash className="h-4 w-4" /> Record ID
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-medium text-foreground">#{log.subject_id}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" /> Timestamp
                                    </dt>
                                    <dd className="mt-1.5 text-sm text-foreground">{new Date(log.created_at).toLocaleString()}</dd>
                                </div>
                                
                                {log.ip_address && (
                                    <div className="sm:col-span-2 md:col-span-4 pt-4 border-t border-border">
                                        <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                            <Server className="h-4 w-4" /> IP Address
                                        </dt>
                                        <dd className="mt-1.5 text-sm text-foreground">{log.ip_address}</dd>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Changes Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Old Values */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="bg-red-50/50 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-500" />
                                <h3 className="text-base font-medium text-red-900">Old Values</h3>
                            </div>
                            <div className="p-0 flex-1 bg-muted/10">
                                <pre className="p-6 text-xs text-foreground/80 overflow-x-auto whitespace-pre-wrap font-mono h-full m-0">
                                    {formatJson(log.old_values)}
                                </pre>
                            </div>
                        </div>

                        {/* New Values */}
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="bg-green-50/50 px-6 py-4 border-b border-border flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-600" />
                                <h3 className="text-base font-medium text-green-900">New Values</h3>
                            </div>
                            <div className="p-0 flex-1 bg-muted/10">
                                <pre className="p-6 text-xs text-foreground/80 overflow-x-auto whitespace-pre-wrap font-mono h-full m-0">
                                    {formatJson(log.new_values)}
                                </pre>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
