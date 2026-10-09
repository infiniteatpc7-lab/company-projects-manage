import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, AlignLeft, Trash2, FileText, Calendar, Building2, CreditCard, Plus, X, Check, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Show({ amc }: any) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        amount: '',
        due_date: '',
        collected_date: '',
        payment_method: '',
        reference: '',
        status: 'Pending',
        notes: '',
    });

    const confirmDeleteAmc = () => {
        if (confirm(`Are you sure you want to delete ${amc.title}? This action cannot be undone.`)) {
            router.delete(route('amc.destroy', amc.id));
        }
    };

    const confirmDeletePayment = (paymentId: number) => {
        if (confirm(`Are you sure you want to delete this payment?`)) {
            router.delete(route('amc.payments.destroy', [amc.id, paymentId]));
        }
    };

    const openAddPaymentModal = () => {
        setEditingPayment(null);
        reset();
        clearErrors();
        
        // Default amount to AMC amount and due date to next due date
        setData({
            amount: amc.amount,
            due_date: amc.next_due_date,
            collected_date: '',
            payment_method: '',
            reference: '',
            status: 'Pending',
            notes: '',
        });
        
        setIsPaymentModalOpen(true);
    };

    const openEditPaymentModal = (payment: any) => {
        setEditingPayment(payment);
        clearErrors();
        setData({
            amount: payment.amount,
            due_date: payment.due_date,
            collected_date: payment.collected_date || '',
            payment_method: payment.payment_method || '',
            reference: payment.reference || '',
            status: payment.status,
            notes: payment.notes || '',
        });
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
    };

    const submitPayment = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingPayment) {
            put(route('amc.payments.update', [amc.id, editingPayment.id]), {
                onSuccess: () => closePaymentModal(),
            });
        } else {
            post(route('amc.payments.store', amc.id), {
                onSuccess: () => closePaymentModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-7xl mx-auto gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('amc.index')}
                            className="inline-flex items-center justify-center rounded-md h-9 w-9 border border-input bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold leading-tight text-foreground">{amc.title}</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    amc.status === 'Active' 
                                        ? 'bg-primary/5 text-primary border-primary/20' 
                                        : amc.status === 'Cancelled'
                                        ? 'bg-muted text-muted-foreground border-input'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    {amc.status}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/60 mt-0.5">AMC Details & Payment History</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={confirmDeleteAmc}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </button>
                        <Link
                            href={route('amc.edit', amc.id)}
                            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit AMC
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={amc.title} />

            <div className="mx-auto max-w-7xl pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-medium text-foreground">AMC Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Client</dt>
                                        <dd className="mt-1 text-sm text-foreground">
                                            {amc.client ? (
                                                <Link href={route('clients.show', amc.client.id)} className="text-primary hover:underline">
                                                    {amc.client.company_name}
                                                </Link>
                                            ) : (
                                                'Unknown Client'
                                            )}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Project</dt>
                                        <dd className="mt-1 text-sm text-foreground">
                                            {amc.project ? (
                                                <Link href={route('projects.show', amc.project.id)} className="text-primary hover:underline">
                                                    {amc.project.name}
                                                </Link>
                                            ) : (
                                                '-'
                                            )}
                                        </dd>
                                    </div>
                                    <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                                            <dd className="mt-1 text-lg font-semibold text-foreground">₹{parseFloat(amc.amount).toFixed(2)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Billing Cycle</dt>
                                            <dd className="mt-1 text-sm font-medium text-foreground">{amc.billing_cycle}</dd>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                                            <dd className="mt-1 text-sm text-foreground">{new Date(amc.start_date).toLocaleDateString()}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-muted-foreground">Next Due Date</dt>
                                            <dd className="mt-1 text-sm font-medium text-foreground">{new Date(amc.next_due_date).toLocaleDateString()}</dd>
                                        </div>
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
                                {amc.notes ? (
                                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{amc.notes}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No notes provided for this AMC.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payments */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                            <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="text-base font-medium text-foreground">Payment History</h3>
                                </div>
                                <button
                                    onClick={openAddPaymentModal}
                                    className="inline-flex h-8 items-center justify-center rounded-md bg-primary/10 text-primary px-3 py-1 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <Plus className="mr-1 h-3.5 w-3.5" />
                                    Add Payment
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left whitespace-nowrap">
                                    <thead className="text-xs uppercase bg-muted/20 border-b border-border text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Due Date</th>
                                            <th className="px-6 py-3 font-medium">Amount</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Collected Date</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {amc.payments && amc.payments.length > 0 ? (
                                            amc.payments.map((payment: any) => (
                                                <tr key={payment.id} className="hover:bg-muted/10 transition-colors">
                                                    <td className="px-6 py-3 text-foreground font-medium">
                                                        {new Date(payment.due_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-3 font-semibold">
                                                        ₹{parseFloat(payment.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
                                                            payment.status === 'Collected' 
                                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                                : payment.status === 'Pending'
                                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                            {payment.status === 'Collected' && <Check className="h-3 w-3" />}
                                                            {payment.status === 'Pending' && <Clock className="h-3 w-3" />}
                                                            {payment.status === 'Overdue' && <AlertTriangle className="h-3 w-3" />}
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-muted-foreground">
                                                        {payment.collected_date ? new Date(payment.collected_date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditPaymentModal(payment)}
                                                                className="text-primary hover:text-primary/80 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => confirmDeletePayment(payment.id)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                                    <CreditCard className="h-8 w-8 mx-auto mb-3 opacity-20" />
                                                    <p>No payments recorded yet.</p>
                                                    <button 
                                                        onClick={openAddPaymentModal}
                                                        className="text-sm text-primary hover:underline mt-1"
                                                    >
                                                        Add the first payment
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                            <h3 className="text-lg font-medium text-foreground">
                                {editingPayment ? 'Edit Payment' : 'Add Payment'}
                            </h3>
                            <button 
                                onClick={closePaymentModal}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitPayment}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="payment_amount" value="Amount (₹) *" />
                                        <input
                                            id="payment_amount"
                                            type="number"
                                            step="0.01"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.amount} className="mt-1.5" />
                                    </div>
                                    
                                    <div>
                                        <InputLabel htmlFor="payment_status" value="Status *" />
                                        <select
                                            id="payment_status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Collected">Collected</option>
                                            <option value="Overdue">Overdue</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-1.5" />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
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
                                    </div>
                                    
                                    <div>
                                        <InputLabel htmlFor="collected_date" value="Collected Date" />
                                        <input
                                            id="collected_date"
                                            type="date"
                                            value={data.collected_date}
                                            onChange={(e) => setData('collected_date', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.collected_date} className="mt-1.5" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="payment_method" value="Payment Method" />
                                        <input
                                            id="payment_method"
                                            type="text"
                                            placeholder="Bank Transfer, PayPal, etc."
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.payment_method} className="mt-1.5" />
                                    </div>
                                    
                                    <div>
                                        <InputLabel htmlFor="reference" value="Reference / Transaction ID" />
                                        <input
                                            id="reference"
                                            type="text"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                        />
                                        <InputError message={errors.reference} className="mt-1.5" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_notes" value="Notes" />
                                    <textarea
                                        id="payment_notes"
                                        rows={2}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                                    />
                                    <InputError message={errors.notes} className="mt-1.5" />
                                </div>
                            </div>
                            
                            <div className="bg-muted/20 px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
