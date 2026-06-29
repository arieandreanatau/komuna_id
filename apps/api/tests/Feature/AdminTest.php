<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserStatus;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        $admin = User::factory()->create(['status' => UserStatus::ACTIVE]);
        $role = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'scope' => 'platform']);
        $admin->roles()->create(['role_id' => $role->id, 'is_active' => true]);
        return $admin;
    }

    public function test_admin_can_access_dashboard(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.stats.total_users', 1);
    }

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $user = User::factory()->create(['status' => UserStatus::ACTIVE]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access_admin(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(401);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('test-token')->plainTextToken;

        User::factory()->count(5)->create(['status' => UserStatus::ACTIVE]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/users');

        $response->assertOk()
            ->assertJsonPath('meta.total', 6);
    }

    public function test_admin_can_view_audit_logs(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/audit-logs');

        $response->assertOk();
    }
}
