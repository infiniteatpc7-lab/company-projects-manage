<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Only create if admin doesn't already exist
        User::firstOrCreate(
            ['email' => 'admin@company.com'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@company.com',
                'password' => Hash::make('Admin@1234'),
            ]
        );
    }
}
