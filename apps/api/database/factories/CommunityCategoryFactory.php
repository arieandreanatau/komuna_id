<?php

namespace Database\Factories;

use App\Models\CommunityCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityCategoryFactory extends Factory
{
    protected $model = CommunityCategory::class;

    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => ucfirst($name),
            'slug' => strtolower($name),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
