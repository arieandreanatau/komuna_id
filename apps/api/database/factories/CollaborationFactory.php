<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\CollaborationStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CollaborationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'title' => fake()->unique()->sentence(3),
            'description' => fake()->paragraph(),
            'status' => CollaborationStatus::INQUIRY,
            'sender_type' => 'community',
            'sender_id' => User::factory(),
            'receiver_type' => 'organization',
            'receiver_id' => User::factory(),
        ];
    }
}
