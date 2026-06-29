<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\EventStatus;
use App\Models\Community;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_events(): void
    {
        Event::factory()->count(3)->create([
            'status' => EventStatus::PUBLISHED,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(2),
        ]);

        $response = $this->getJson('/api/v1/events');

        $response->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_user_can_create_event(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $user->id]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/communities/{$community->id}/events", [
                'title' => 'Test Event',
                'description' => 'A test event description that is long enough',
                'start_date' => now()->addDays(7)->toDateTimeString(),
                'end_date' => now()->addDays(7)->addHours(3)->toDateTimeString(),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Test Event');
    }

    public function test_user_can_register_for_event(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create([
            'status' => EventStatus::PUBLISHED,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(2),
        ]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/events/{$event->id}/register");

        $response->assertStatus(201);

        $this->assertDatabaseHas('event_registrations', [
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_user_cannot_register_twice(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create([
            'status' => EventStatus::PUBLISHED,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(2),
        ]);

        $event->registrations()->create([
            'user_id' => $user->id,
            'status' => 'registered',
            'registered_at' => now(),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/events/{$event->id}/register");

        $response->assertStatus(422);
    }

    public function test_organizer_can_publish_event(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create([
            'organizer_id' => $user->id,
            'status' => EventStatus::DRAFT,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(2),
        ]);
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/events/{$event->id}/publish");

        $response->assertOk();

        $event->refresh();
        $this->assertEquals(EventStatus::PUBLISHED, $event->status);
    }

    public function test_non_organizer_cannot_publish_event(): void
    {
        $organizer = User::factory()->create();
        $other = User::factory()->create();
        $event = Event::factory()->create([
            'organizer_id' => $organizer->id,
            'status' => EventStatus::DRAFT,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(2),
        ]);
        $token = $other->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/events/{$event->id}/publish");

        $response->assertStatus(403);
    }
}
