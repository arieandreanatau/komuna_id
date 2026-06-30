<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BrandFactory extends Factory
{
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'name' => fake()->unique()->company(),
            'slug' => fake()->unique()->slug(2),
            'description' => fake()->sentence(),
            'email' => fake()->unique()->safeEmail(),
            'website' => fake()->url(),
            'owner_id' => User::factory(),
            'organization_id' => null,
            'status' => 'draft',
        ];
    }
}
