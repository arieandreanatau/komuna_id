<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'uuid' => fake()->uuid(),
            'title' => ucfirst($title),
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(3),
            'organizer_id' => User::factory(),
            'status' => 'draft',
            'start_date' => now()->addDays(7),
            'end_date' => now()->addDays(7)->addHours(3),
            'location' => fake()->city(),
            'is_online' => false,
            'current_participants' => 0,
            'ticket_price' => 0,
            'currency' => 'IDR',
        ];
    }
}
