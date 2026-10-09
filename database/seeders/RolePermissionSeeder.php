<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Define All Permissions ───────────────────────────────────────
        $permissions = [
            // Dashboard
            'dashboard.view',

            // Global Search
            'search.use',

            // Clients
            'clients.view',
            'clients.create',
            'clients.edit',
            'clients.delete',

            // Projects
            'projects.view',
            'projects.create',
            'projects.edit',
            'projects.delete',

            // Domains
            'domains.view',
            'domains.create',
            'domains.edit',
            'domains.delete',

            // Servers
            'servers.view',
            'servers.create',
            'servers.edit',
            'servers.delete',

            // AMC
            'amc.view',
            'amc.create',
            'amc.edit',
            'amc.delete',
            'amc.payments',

            // Reminders
            'reminders.view',
            'reminders.create',
            'reminders.edit',
            'reminders.delete',

            // Activity Logs (sensitive)
            'activity_logs.view',

            // Credentials (sensitive)
            'credentials.view',
            'credentials.create',
            'credentials.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ─── Admin Role ───────────────────────────────────────────────────
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        // ─── Staff Role ───────────────────────────────────────────────────
        $staffRole = Role::firstOrCreate(['name' => 'Staff', 'guard_name' => 'web']);

        $staffDefaultPermissions = [
            'dashboard.view',
            'search.use',
            'clients.view',
            'projects.view',
            'domains.view',
            'servers.view',
            'amc.view',
            'reminders.view',
            'reminders.create',
            'reminders.edit',
        ];

        $staffRole->syncPermissions($staffDefaultPermissions);

        // ─── Master Admin User ─────────────────────────────────────────────
        $adminName     = env('ADMIN_NAME', 'Master Admin');
        $adminEmail    = env('ADMIN_EMAIL');
        $adminPassword = env('ADMIN_PASSWORD');

        if (empty($adminEmail) || empty($adminPassword)) {
            $this->command->error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the master admin.');
            return;
        }

        $admin = User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name'              => $adminName,
                'password'          => Hash::make($adminPassword),
                'email_verified_at' => now(),
            ]
        );

        // Ensure admin has the Admin role
        if (!$admin->hasRole('Admin')) {
            $admin->assignRole('Admin');
        }

        $this->command->info("Master admin created/updated: {$adminEmail}");
    }
}
