<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\CommunityCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CommunityFactory extends Factory
{
    protected $model = Community::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'uuid' => fake()->uuid(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(3),
            'category_id' => CommunityCategory::factory(),
            'owner_id' => User::factory(),
            'status' => 'approved',
            'is_public' => true,
            'join_mode' => 'open',
            'member_count' => fake()->numberBetween(1, 100),
        ];
    }
}
