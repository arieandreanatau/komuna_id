<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\CommunityStatus;
use App\Models\Community;
use App\Models\CommunityCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityTest extends TestCase
{
    use RefreshDatabase;

    public function test_communities_can_be_listed(): void
    {
        Community::factory()->count(3)->create(['status' => CommunityStatus::APPROVED]);

        $response = $this->getJson('/api/v1/communities');

        $response->assertOk();
    }

    public function test_community_can_be_created(): void
    {
        $user = User::factory()->create();
        $category = CommunityCategory::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/communities', [
            'name' => 'Test Community',
            'description' => 'A test community',
            'category_id' => $category->id,
            'reason' => 'Testing community creation',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('communities', ['name' => 'Test Community']);
    }

    public function test_community_can_be_updated_by_owner(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/v1/communities/{$community->id}", [
            'description' => 'Updated description',
        ]);

        $response->assertOk();
    }

    public function test_community_cannot_be_updated_by_non_owner(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($other)->putJson("/api/v1/communities/{$community->id}", [
            'description' => 'Hacked',
        ]);

        $response->assertForbidden();
    }

    public function test_community_can_be_submitted_for_review(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $user->id, 'status' => CommunityStatus::DRAFT]);

        $response = $this->actingAs($user)->postJson("/api/v1/communities/{$community->id}/submit-review");

        $response->assertOk();
        $this->assertDatabaseHas('communities', ['id' => $community->id, 'status' => CommunityStatus::PENDING_REVIEW]);
    }

    public function test_community_can_be_joined(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['status' => CommunityStatus::APPROVED, 'join_mode' => 'open']);

        $response = $this->actingAs($user)->postJson("/api/v1/communities/{$community->id}/join");

        $response->assertCreated();
    }

    public function test_community_member_can_leave(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['status' => CommunityStatus::APPROVED]);
        $community->members()->create([
            'user_id' => $user->id,
            'role' => 'member',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        $response = $this->actingAs($user)->postJson("/api/v1/communities/{$community->id}/leave");

        $response->assertOk();
    }
}
