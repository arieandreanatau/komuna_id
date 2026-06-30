<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\CommunityStatus;
use App\Models\Community;
use App\Models\CommunityCategory;
use App\Models\CommunityMember;
use App\Models\CommunityRoleAssignment;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunityRoleTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private User $admin;
    private User $eventManager;
    private User $member;
    private User $stranger;
    private Community $community;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['status' => 'active']);
        $this->admin = User::factory()->create(['status' => 'active']);
        $this->eventManager = User::factory()->create(['status' => 'active']);
        $this->member = User::factory()->create(['status' => 'active']);
        $this->stranger = User::factory()->create(['status' => 'active']);

        $category = CommunityCategory::factory()->create();

        $this->community = Community::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test Community',
            'slug' => 'test-community',
            'description' => 'A test community',
            'category_id' => $category->id,
            'owner_id' => $this->owner->id,
            'status' => CommunityStatus::APPROVED,
            'member_count' => 4,
        ]);

        CommunityMember::create([
            'community_id' => $this->community->id,
            'user_id' => $this->owner->id,
            'role' => 'admin',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        CommunityMember::create([
            'community_id' => $this->community->id,
            'user_id' => $this->admin->id,
            'role' => 'member',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        CommunityMember::create([
            'community_id' => $this->community->id,
            'user_id' => $this->eventManager->id,
            'role' => 'member',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        CommunityMember::create([
            'community_id' => $this->community->id,
            'user_id' => $this->member->id,
            'role' => 'member',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        $this->seedRoleAssignments();
    }

    private function seedRoleAssignments(): void
    {
        $caRole = Role::firstOrCreate(['name' => 'Community Admin', 'slug' => 'community-admin', 'scope' => 'community']);
        $emRole = Role::firstOrCreate(['name' => 'Event Manager', 'slug' => 'event-manager', 'scope' => 'community']);
        $vcRole = Role::firstOrCreate(['name' => 'Volunteer Coordinator', 'slug' => 'volunteer-coordinator', 'scope' => 'community']);

        CommunityRoleAssignment::create([
            'community_id' => $this->community->id,
            'user_id' => $this->admin->id,
            'role_id' => $caRole->id,
            'assigned_by' => $this->owner->id,
            'is_active' => true,
            'assigned_at' => now(),
        ]);

        CommunityRoleAssignment::create([
            'community_id' => $this->community->id,
            'user_id' => $this->eventManager->id,
            'role_id' => $emRole->id,
            'assigned_by' => $this->owner->id,
            'is_active' => true,
            'assigned_at' => now(),
        ]);
    }

    public function test_owner_can_view_dashboard(): void
    {
        $response = $this->actingAs($this->owner)
            ->getJson("/api/v1/communities/{$this->community->id}/dashboard");

        $response->assertOk();
    }

    public function test_community_admin_can_view_dashboard(): void
    {
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/communities/{$this->community->id}/dashboard");

        $response->assertOk();
    }

    public function test_event_manager_can_view_dashboard(): void
    {
        $response = $this->actingAs($this->eventManager)
            ->getJson("/api/v1/communities/{$this->community->id}/dashboard");

        $response->assertOk();
    }

    public function test_stranger_cannot_view_dashboard(): void
    {
        $response = $this->actingAs($this->stranger)
            ->getJson("/api/v1/communities/{$this->community->id}/dashboard");

        $response->assertForbidden();
    }

    public function test_owner_can_assign_community_admin(): void
    {
        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/communities/{$this->community->id}/roles", [
                'user_id' => $this->member->id,
                'role_slug' => 'community-admin',
            ]);

        $response->assertCreated();
    }

    public function test_community_admin_cannot_assign_roles(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/communities/{$this->community->id}/roles", [
                'user_id' => $this->member->id,
                'role_slug' => 'community-admin',
            ]);

        $response->assertForbidden();
    }

    public function test_owner_can_remove_member(): void
    {
        $response = $this->actingAs($this->owner)
            ->deleteJson("/api/v1/communities/{$this->community->id}/members/{$this->member->id}");

        $response->assertOk();
    }

    public function test_community_admin_can_remove_member(): void
    {
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/communities/{$this->community->id}/members/{$this->member->id}");

        $response->assertOk();
    }

    public function test_event_manager_cannot_remove_member(): void
    {
        $response = $this->actingAs($this->eventManager)
            ->deleteJson("/api/v1/communities/{$this->community->id}/members/{$this->member->id}");

        $response->assertForbidden();
    }

    public function test_stranger_cannot_remove_member(): void
    {
        $response = $this->actingAs($this->stranger)
            ->deleteJson("/api/v1/communities/{$this->community->id}/members/{$this->member->id}");

        $response->assertForbidden();
    }

    public function test_owner_can_create_event(): void
    {
        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/communities/{$this->community->id}/events", [
                'title' => 'Test Event',
                'description' => 'Test event description',
                'start_date' => now()->addDays(7)->toDateTimeString(),
                'end_date' => now()->addDays(7)->addHours(3)->toDateTimeString(),
            ]);

        $response->assertCreated();
    }

    public function test_event_manager_can_create_event(): void
    {
        $response = $this->actingAs($this->eventManager)
            ->postJson("/api/v1/communities/{$this->community->id}/events", [
                'title' => 'EM Event',
                'description' => 'Event from EM',
                'start_date' => now()->addDays(7)->toDateTimeString(),
                'end_date' => now()->addDays(7)->addHours(3)->toDateTimeString(),
            ]);

        $response->assertCreated();
    }

    public function test_member_cannot_create_event(): void
    {
        $response = $this->actingAs($this->member)
            ->postJson("/api/v1/communities/{$this->community->id}/events", [
                'title' => 'Member Event',
                'description' => 'Not allowed',
                'start_date' => now()->addDays(7)->toDateTimeString(),
                'end_date' => now()->addDays(7)->addHours(3)->toDateTimeString(),
            ]);

        $response->assertForbidden();
    }

    public function test_member_cannot_view_members_list(): void
    {
        $response = $this->actingAs($this->member)
            ->getJson("/api/v1/communities/{$this->community->id}/members");

        $response->assertForbidden();
    }

    public function test_owner_can_view_role_history(): void
    {
        $response = $this->actingAs($this->owner)
            ->getJson("/api/v1/communities/{$this->community->id}/role-history");

        $response->assertOk();
    }

    public function test_owner_can_update_community_profile(): void
    {
        $response = $this->actingAs($this->owner)
            ->putJson("/api/v1/communities/{$this->community->id}/profile", [
                'description' => 'Updated description',
            ]);

        $response->assertOk();
    }

    public function test_community_admin_can_update_community_profile(): void
    {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/communities/{$this->community->id}/profile", [
                'description' => 'CA updated description',
            ]);

        $response->assertOk();
    }

    public function test_event_manager_cannot_update_community_profile(): void
    {
        $response = $this->actingAs($this->eventManager)
            ->putJson("/api/v1/communities/{$this->community->id}/profile", [
                'description' => 'EM cannot update',
            ]);

        $response->assertForbidden();
    }

    public function test_owner_can_view_audit_logs(): void
    {
        $response = $this->actingAs($this->owner)
            ->getJson("/api/v1/communities/{$this->community->id}/audit-logs");

        $response->assertOk();
    }

    public function test_member_cannot_view_audit_logs(): void
    {
        $response = $this->actingAs($this->member)
            ->getJson("/api/v1/communities/{$this->community->id}/audit-logs");

        $response->assertForbidden();
    }

    public function test_owner_can_update_settings(): void
    {
        $response = $this->actingAs($this->owner)
            ->putJson("/api/v1/communities/{$this->community->id}/settings", [
                'is_public' => false,
                'join_mode' => 'approval_required',
            ]);

        $response->assertOk();
    }

    public function test_community_admin_cannot_update_settings(): void
    {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/communities/{$this->community->id}/settings", [
                'is_public' => false,
            ]);

        $response->assertForbidden();
    }

    public function test_scoped_role_prevents_cross_community_access(): void
    {
        $otherCommunity = Community::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'name' => 'Other Community',
            'slug' => 'other-community',
            'description' => 'Another community',
            'category_id' => CommunityCategory::first()->id,
            'owner_id' => $this->stranger->id,
            'status' => CommunityStatus::APPROVED,
            'member_count' => 1,
        ]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/communities/{$otherCommunity->id}/dashboard");

        $response->assertForbidden();
    }

    public function test_banned_member_cannot_access_community(): void
    {
        CommunityMember::where('community_id', $this->community->id)
            ->where('user_id', $this->member->id)
            ->update(['status' => 'banned']);

        $response = $this->actingAs($this->member)
            ->getJson("/api/v1/communities/{$this->community->id}/dashboard");

        $response->assertForbidden();
    }
}
