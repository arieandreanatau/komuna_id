<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::firstOrCreate(
            ['slug' => 'super-admin'],
            ['name' => 'Super Admin', 'scope' => 'platform']
        );

        $this->admin = User::factory()->create();
        $this->admin->roles()->create([
            'role_id' => $role->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_dashboard_returns_stats(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/dashboard');

        $response->assertOk()->assertJsonStructure([
            'success',
            'data' => ['stats' => ['total_users', 'total_communities', 'total_events']],
        ]);
    }

    public function test_admin_can_list_users(): void
    {
        User::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/users');

        $response->assertOk();
    }

    public function test_admin_can_view_audit_logs(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/audit-logs');

        $response->assertOk();
    }
}
