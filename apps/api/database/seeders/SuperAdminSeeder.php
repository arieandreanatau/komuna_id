<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@komuna.id',
            'password' => Hash::make('password'),
            'status' => UserStatus::ACTIVE,
            'email_verified_at' => now(),
        ]);

        $admin->profile()->create([
            'bio' => 'Super Administrator KomunaID',
        ]);

        $superAdminRole = Role::where('slug', 'super-admin')->first();
        if ($superAdminRole) {
            $admin->roles()->create([
                'role_id' => $superAdminRole->id,
                'is_active' => true,
            ]);
        }
    }
}
