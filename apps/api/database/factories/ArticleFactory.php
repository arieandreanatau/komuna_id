<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->unique()->words(4, true);
        return [
            'uuid' => fake()->uuid(),
            'title' => ucfirst($title),
            'slug' => Str::slug($title),
            'content' => '<p>' . fake()->paragraph(5) . '</p>',
            'excerpt' => fake()->sentence(),
            'author_id' => \App\Models\User::factory(),
            'status' => 'draft',
        ];
    }
}
