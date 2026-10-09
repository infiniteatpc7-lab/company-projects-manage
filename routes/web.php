<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/search', [App\Http\Controllers\GlobalSearchController::class, 'index'])->name('search');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('clients', App\Http\Controllers\ClientController::class);
    Route::resource('projects', App\Http\Controllers\ProjectController::class);
    Route::resource('domains', App\Http\Controllers\DomainController::class);
    Route::resource('servers', App\Http\Controllers\ServerController::class);
    Route::resource('amc', App\Http\Controllers\AmcController::class);
    Route::post('amc/{amc}/payments', [App\Http\Controllers\AmcController::class, 'storePayment'])->name('amc.payments.store');
    Route::put('amc/{amc}/payments/{payment}', [App\Http\Controllers\AmcController::class, 'updatePayment'])->name('amc.payments.update');
    Route::delete('amc/{amc}/payments/{payment}', [App\Http\Controllers\AmcController::class, 'destroyPayment'])->name('amc.payments.destroy');
    Route::resource('reminders', App\Http\Controllers\ReminderController::class);
    Route::resource('activity-logs', App\Http\Controllers\ActivityLogController::class)->only(['index', 'show']);

    // User Management (Admin only)
    Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/auth.php';
