<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\EventStatus;
use App\Models\Community;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_events_can_be_listed(): void
    {
        Event::factory()->count(3)->create(['status' => EventStatus::PUBLISHED]);

        $response = $this->getJson('/api/v1/events');

        $response->assertOk();
    }

    public function test_event_can_be_created(): void
    {
        $user = User::factory()->create();
        $community = Community::factory()->create(['owner_id' => $user->id]);

        $response = $this->actingAs($user)->postJson("/api/v1/communities/{$community->id}/events", [
            'title' => 'Test Event',
            'description' => 'An event',
            'start_date' => now()->addDays(7)->toDateTimeString(),
            'end_date' => now()->addDays(7)->addHours(3)->toDateTimeString(),
        ]);

        $response->assertCreated();
    }

    public function test_event_can_be_published(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['organizer_id' => $user->id, 'status' => EventStatus::DRAFT]);

        $response = $this->actingAs($user)->postJson("/api/v1/events/{$event->id}/publish");

        $response->assertOk();
        $this->assertDatabaseHas('events', ['id' => $event->id, 'status' => EventStatus::PUBLISHED]);
    }

    public function test_event_can_be_registered(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['status' => EventStatus::PUBLISHED, 'max_participants' => 100, 'current_participants' => 0]);

        $response = $this->actingAs($user)->postJson("/api/v1/events/{$event->id}/register");

        $response->assertCreated();
    }

    public function test_event_full_cannot_register(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['status' => EventStatus::PUBLISHED, 'max_participants' => 1, 'current_participants' => 1]);

        $response = $this->actingAs($user)->postJson("/api/v1/events/{$event->id}/register");

        $response->assertStatus(422);
    }

    public function test_event_check_in_works(): void
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['organizer_id' => $user->id]);
        $qrCode = 'test-qr-code';
        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'registered',
            'qr_code' => $qrCode,
        ]);

        $response = $this->actingAs($user)->postJson("/api/v1/events/{$event->id}/check-in", [
            'qr_code' => $qrCode,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('event_registrations', ['event_id' => $event->id, 'status' => 'checked_in']);
    }
}
