import { usePage } from '@inertiajs/react';

/**
 * Hook to check user permissions and roles from Inertia shared props.
 */
export function usePermissions() {
    const { auth } = usePage().props as {
        auth: {
            user: { id: number; name: string; email: string } | null;
            permissions: string[];
            roles: string[];
        };
    };

    const permissions: string[] = auth?.permissions ?? [];
    const roles: string[] = auth?.roles ?? [];

    const can = (permission: string): boolean => permissions.includes(permission);
    const hasRole = (role: string): boolean => roles.includes(role);
    const isAdmin = (): boolean => roles.includes('Admin');

    return { can, hasRole, isAdmin, permissions, roles };
}
