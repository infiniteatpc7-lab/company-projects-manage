<?php

/**
 * ONE-TIME MIGRATION RUNNER FOR HOSTINGER SHARED HOSTING
 * -------------------------------------------------------
 * Use this ONLY if you cannot run migrations via SSH.
 * DELETE THIS FILE immediately after running migrations!
 * Access: https://yourdomain.com/migrate-run.php?token=AMC_INFINITE_MIGRATE_2024
 */

$secret = 'AMC_INFINITE_MIGRATE_2024';

if (!isset($_GET['token']) || $_GET['token'] !== $secret) {
    http_response_code(403);
    die('Forbidden. Provide ?token=YOUR_SECRET');
}

// Bootstrap Laravel
define('LARAVEL_START', microtime(true));
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '<pre style="font-family:monospace;background:#1a1a1a;color:#00ff00;padding:20px;">';
echo "=== Laravel Migration Runner ===\n\n";

// Run migrations
try {
    $exitCode = \Artisan::call('migrate', ['--force' => true]);
    echo \Artisan::output();
    echo "\n✅ Migrations completed successfully!\n";
} catch (\Exception $e) {
    echo "❌ Migration error: " . $e->getMessage() . "\n";
}

// Also run storage:link
try {
    \Artisan::call('storage:link');
    echo \Artisan::output();
    echo "✅ Storage link created!\n";
} catch (\Exception $e) {
    echo "⚠️  Storage link: " . $e->getMessage() . "\n";
}

// Cache config and routes
try {
    \Artisan::call('config:cache');
    echo "✅ Config cached!\n";
    \Artisan::call('route:cache');
    echo "✅ Routes cached!\n";
    \Artisan::call('view:cache');
    echo "✅ Views cached!\n";
} catch (\Exception $e) {
    echo "⚠️  Cache: " . $e->getMessage() . "\n";
}

echo "\n⚠️  IMPORTANT: DELETE this file (migrate-run.php) from the server NOW!\n";
echo '</pre>';
