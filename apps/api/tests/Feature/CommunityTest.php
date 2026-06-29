<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\CommunityStatus;
use App\Models\Community;
use App\Models\CommunityCategory;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_communities(): void
    {
        Community::factory()->count(3)->create([
            'status' => CommunityStatus::APPROVED,
            'is_public' => true,
        ]);

        $response = $this->getJson('/api/v1/communities');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'meta',
            ]);
    }

    public function test_user_can_create_community(): void
    {
        $user = User::factory()->create();
        $category = CommunityCategory::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/communities', [
                'name' => 'Test Community',
                'description' => 'A test community description that is long enough',
                'category_id' => $category->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Test Community');

        $this->assertDatabaseHas('communities', ['name' => 'Test Community']);
    }

    public function test_unauthenticated_user_cannot_create_community(): void
    {
        $response = $this->postJson('/api/v1/communities', [
            'name' => 'Test Community',
            'description' => 'A test community description',
            'category_id' => 1,
        ]);

        $response->assertStatus(401);
    }

    public function test_owner_can_update_community(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $user->id]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/v1/communities/{$community->id}", [
                'name' => 'Updated Community Name',
            ]);

        $response->assertOk();
    }

    public function test_non_owner_cannot_update_community(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $owner->id]);
        $token = $other->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/v1/communities/{$community->id}", [
                'name' => 'Hacked Name',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_approve_community(): void
    {
        $admin = User::factory()->create(['status' => \App\Enums\UserStatus::ACTIVE]);
        $role = Role::create(['name' => 'Super Admin', 'slug' => 'super-admin', 'scope' => 'platform']);
        $admin->roles()->create(['role_id' => $role->id, 'is_active' => true]);

        $community = Community::factory()->create(['status' => CommunityStatus::PENDING_REVIEW]);
        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/communities/{$community->id}/approve");

        $response->assertOk();

        $community->refresh();
        $this->assertEquals(CommunityStatus::APPROVED, $community->status);
    }
}
