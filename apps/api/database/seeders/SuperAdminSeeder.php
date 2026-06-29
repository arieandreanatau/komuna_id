<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        if (User::where('email', 'admin@komuna.id')->exists()) {
            return;
        }

        $user = User::create([
            'uuid' => (string) Str::uuid(),
            'name' => 'Super Admin',
            'email' => 'admin@komuna.id',
            'password' => Hash::make('password'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $user->id,
            'bio' => 'Super Administrator KomunaID',
        ]);

        $role = Role::where('slug', 'super-admin')->first();
        if ($role) {
            $user->roles()->create([
                'role_id' => $role->id,
                'is_active' => true,
            ]);
        }
    }
}
