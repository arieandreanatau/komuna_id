<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\ApprovalStatus;
use App\Models\Brand;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandTest extends TestCase
{
    use RefreshDatabase;

    public function test_brand_can_be_created(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/brands', [
            'name' => 'Test Brand',
            'description' => 'A test brand',
            'email' => 'test@brand.com',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('brands', ['name' => 'Test Brand']);
    }

    public function test_brand_can_be_updated_by_owner(): void
    {
        $user = User::factory()->create();
        $brand = Brand::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/v1/brands/{$brand->id}", [
            'description' => 'Updated brand',
        ]);

        $response->assertOk();
    }

    public function test_brand_can_be_submitted_for_review(): void
    {
        $user = User::factory()->create();
        $brand = Brand::factory()->create(['owner_id' => $user->id, 'status' => ApprovalStatus::DRAFT]);

        $response = $this->actingAs($user)->postJson("/api/v1/brands/{$brand->id}/submit-review");

        $response->assertOk();
        $this->assertDatabaseHas('brands', ['id' => $brand->id, 'status' => ApprovalStatus::PENDING_REVIEW]);
    }

    public function test_brand_can_be_approved_by_admin(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->create(['role_id' => Role::firstOrCreate(['name' => 'Super Admin', 'slug' => 'super-admin', 'scope' => 'platform'])->id, 'is_active' => true]);
        $brand = Brand::factory()->create(['status' => ApprovalStatus::PENDING_REVIEW]);

        $response = $this->actingAs($admin)->postJson("/api/v1/brands/{$brand->id}/approve");

        $response->assertOk();
        $this->assertDatabaseHas('brands', ['id' => $brand->id, 'status' => ApprovalStatus::APPROVED]);
    }
}
