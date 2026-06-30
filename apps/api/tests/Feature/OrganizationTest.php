<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ApprovalStatus;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_organization_can_be_created(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/organizations', [
            'name' => 'Test Org',
            'description' => 'A test organization',
            'email' => 'test@org.com',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('organizations', ['name' => 'Test Org']);
    }

    public function test_organization_can_be_updated_by_owner(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/v1/organizations/{$org->id}", [
            'description' => 'Updated org',
        ]);

        $response->assertOk();
    }

    public function test_organization_can_be_submitted_for_review(): void
    {
        $user = User::factory()->create();
        $org = Organization::factory()->create(['owner_id' => $user->id, 'status' => ApprovalStatus::DRAFT]);

        $response = $this->actingAs($user)->postJson("/api/v1/organizations/{$org->id}/submit-review");

        $response->assertOk();
        $this->assertDatabaseHas('organizations', ['id' => $org->id, 'status' => ApprovalStatus::PENDING_REVIEW]);
    }

    public function test_organization_can_be_approved_by_admin(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->create(['role_id' => \App\Models\Role::firstOrCreate(['name' => 'Super Admin', 'slug' => 'super-admin', 'scope' => 'platform'])->id, 'is_active' => true]);
        $org = Organization::factory()->create(['status' => ApprovalStatus::PENDING_REVIEW]);

        $response = $this->actingAs($admin)->postJson("/api/v1/organizations/{$org->id}/approve");

        $response->assertOk();
        $this->assertDatabaseHas('organizations', ['id' => $org->id, 'status' => ApprovalStatus::APPROVED]);
    }
}
