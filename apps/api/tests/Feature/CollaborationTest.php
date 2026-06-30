<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\CollaborationStatus;
use App\Models\Collaboration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollaborationTest extends TestCase
{
    use RefreshDatabase;

    public function test_collaboration_can_be_created(): void
    {
        $user = User::factory()->create();
        $receiver = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/collaborations', [
            'title' => 'Test Collab',
            'description' => 'A collaboration',
            'sender_type' => 'brand',
            'sender_id' => $user->id,
            'receiver_type' => 'community',
            'receiver_id' => $receiver->id,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('collaborations', ['title' => 'Test Collab']);
    }

    public function test_collaboration_can_be_accepted(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $collab = Collaboration::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => CollaborationStatus::INQUIRY,
        ]);

        $response = $this->actingAs($receiver)->postJson("/api/v1/collaborations/{$collab->id}/accept");

        $response->assertOk();
        $this->assertDatabaseHas('collaborations', ['id' => $collab->id, 'status' => CollaborationStatus::NEGOTIATION]);
    }

    public function test_collaboration_can_be_rejected(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $collab = Collaboration::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => CollaborationStatus::INQUIRY,
        ]);

        $response = $this->actingAs($receiver)->postJson("/api/v1/collaborations/{$collab->id}/reject");

        $response->assertOk();
        $this->assertDatabaseHas('collaborations', ['id' => $collab->id, 'status' => CollaborationStatus::REJECTED]);
    }

    public function test_collaboration_can_be_started(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $collab = Collaboration::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => CollaborationStatus::NEGOTIATION,
        ]);

        $response = $this->actingAs($sender)->postJson("/api/v1/collaborations/{$collab->id}/start");

        $response->assertOk();
        $this->assertDatabaseHas('collaborations', ['id' => $collab->id, 'status' => CollaborationStatus::ACTIVE]);
    }

    public function test_collaboration_can_be_completed(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $collab = Collaboration::factory()->create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'status' => CollaborationStatus::ACTIVE,
        ]);

        $response = $this->actingAs($sender)->postJson("/api/v1/collaborations/{$collab->id}/complete");

        $response->assertOk();
        $this->assertDatabaseHas('collaborations', ['id' => $collab->id, 'status' => CollaborationStatus::COMPLETED]);
    }
}
