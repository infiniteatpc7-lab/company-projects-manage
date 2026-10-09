import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShieldCheck, Plus, Pencil, Trash2, X, Check, UserCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

interface Props {
    users: User[];
    roles: string[];
    flash?: { success?: string; error?: string };
}

export default function UsersIndex({ users, roles, flash }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser]         = useState<User | null>(null);
    const [deletingUser, setDeletingUser]       = useState<User | null>(null);

    // Create form
    const createForm = useForm({
        name:     '',
        email:    '',
        password: '',
        role:     roles[0] ?? 'Staff',
    });

    // Edit form
    const editForm = useForm({
        name:     '',
        email:    '',
        password: '',
        role:     '',
    });

    const openEdit = (user: User) => {
        setEditingUser(user);
        editForm.setData({
            name:     user.name,
            email:    user.email,
            password: '',
            role:     user.roles[0] ?? 'Staff',
        });
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('users.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(route('users.update', editingUser.id), {
            onSuccess: () => setEditingUser(null),
        });
    };

    const confirmDelete = () => {
        if (!deletingUser) return;
        router.delete(route('users.destroy', deletingUser.id), {
            onFinish: () => setDeletingUser(null),
        });
    };

    const roleColors: Record<string, string> = {
        Admin: 'bg-primary/10 text-primary border border-primary/20',
        Staff: 'bg-muted text-muted-foreground border border-border',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">User Management</h1>
                            <p className="text-sm text-muted-foreground">{users.length} user{users.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </button>
                </div>
            }
        >
            <Head title="User Management" />

            {/* Flash messages */}
            {flash?.success && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
                    <Check className="h-4 w-4 shrink-0" />
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                    <X className="h-4 w-4 shrink-0" />
                    {flash.error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                <th className="text-left px-6 py-3 font-medium text-muted-foreground">User</th>
                                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Email</th>
                                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role</th>
                                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <UserCircle className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="font-medium text-foreground">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {user.roles.map((role) => (
                                            <span
                                                key={role}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] ?? 'bg-muted text-muted-foreground'}`}
                                            >
                                                {role}
                                            </span>
                                        ))}
                                        {user.roles.length === 0 && (
                                            <span className="text-muted-foreground text-xs italic">No role</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(user)}
                                                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                title="Edit user"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingUser(user)}
                                                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-base font-semibold text-foreground">Add New User</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={submitCreate} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Full name"
                                    required
                                />
                                {createForm.errors.name && <p className="mt-1 text-xs text-destructive">{createForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={e => createForm.setData('email', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="email@company.com"
                                    required
                                />
                                {createForm.errors.email && <p className="mt-1 text-xs text-destructive">{createForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                                <input
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={e => createForm.setData('password', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                                {createForm.errors.password && <p className="mt-1 text-xs text-destructive">{createForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                                <select
                                    value={createForm.data.role}
                                    onChange={e => createForm.setData('role', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {createForm.errors.role && <p className="mt-1 text-xs text-destructive">{createForm.errors.role}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                >
                                    {createForm.processing ? 'Creating…' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-base font-semibold text-foreground">Edit User</h2>
                            <button onClick={() => setEditingUser(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={submitEdit} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                                {editForm.errors.name && <p className="mt-1 text-xs text-destructive">{editForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={e => editForm.setData('email', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                                {editForm.errors.email && <p className="mt-1 text-xs text-destructive">{editForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">New Password <span className="text-muted-foreground font-normal">(leave blank to keep)</span></label>
                                <input
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={e => editForm.setData('password', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Leave blank to keep current"
                                />
                                {editForm.errors.password && <p className="mt-1 text-xs text-destructive">{editForm.errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                                <select
                                    value={editForm.data.role}
                                    onChange={e => editForm.setData('role', e.target.value)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {editForm.errors.role && <p className="mt-1 text-xs text-destructive">{editForm.errors.role}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                >
                                    {editForm.processing ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h2 className="text-base font-semibold text-foreground mb-2">Delete User</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Are you sure you want to delete <strong className="text-foreground">{deletingUser.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeletingUser(null)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
