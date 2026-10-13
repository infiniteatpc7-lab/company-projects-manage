<?php

/**
 * ONE-TIME SEED RUNNER - DELETE AFTER USE!
 * Access: https://yourdomain.com/seed-run.php?token=AMC_INFINITE_MIGRATE_2024
 */

$secret = 'AMC_INFINITE_MIGRATE_2024';
if (!isset($_GET['token']) || $_GET['token'] !== $secret) {
    http_response_code(403);
    die('Forbidden.');
}

define('LARAVEL_START', microtime(true));
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '<pre style="font-family:monospace;background:#1a1a1a;color:#00ff00;padding:20px;font-size:14px;">';
echo "=== Seed + Admin User Runner ===\n\n";

// Directly create admin user without seeder class
try {
    $exists = \App\Models\User::where('email', 'admin@company.com')->first();
    if ($exists) {
        echo "ℹ️  Admin user already exists (email: admin@company.com)\n";
    } else {
        \App\Models\User::create([
            'name'     => 'Admin',
            'email'    => 'admin@company.com',
            'password' => \Illuminate\Support\Facades\Hash::make('Admin@1234'),
        ]);
        echo "✅ Admin user created!\n";
        echo "   Email:    admin@company.com\n";
        echo "   Password: Admin@1234\n\n";
    }
} catch (\Exception $e) {
    echo "❌ User create error: " . $e->getMessage() . "\n";
}

// Run RolePermissionSeeder
try {
    \Artisan::call('db:seed', [
        '--class' => 'RolePermissionSeeder',
        '--force' => true,
    ]);
    $output = \Artisan::output();
    echo $output ?: "✅ RolePermissionSeeder ran successfully!\n";
} catch (\Exception $e) {
    echo "⚠️  RolePermissionSeeder: " . $e->getMessage() . "\n";
}

// Assign Super Admin role if roles exist
try {
    $user = \App\Models\User::where('email', 'admin@company.com')->first();
    if ($user && method_exists($user, 'assignRole')) {
        $user->assignRole('super-admin');
        echo "✅ Super Admin role assigned!\n";
    } elseif ($user && method_exists($user, 'syncRoles')) {
        $role = \Spatie\Permission\Models\Role::where('name', 'like', '%admin%')->first();
        if ($role) {
            $user->syncRoles([$role->name]);
            echo "✅ Role '{$role->name}' assigned to admin!\n";
        }
    }
} catch (\Exception $e) {
    echo "⚠️  Role assign: " . $e->getMessage() . "\n";
}

// Clear caches
\Artisan::call('config:cache');
echo "✅ Config cached!\n";
\Artisan::call('route:cache');
echo "✅ Routes cached!\n";

echo "\n⚠️  DELETE this file (seed-run.php) from server NOW!\n";
echo '</pre>';
