<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CommunityCategory;
use Illuminate\Database\Seeder;

class CommunityCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'icon' => 'laptop', 'description' => 'Komunitas teknologi dan programming'],
            ['name' => 'Design', 'slug' => 'design', 'icon' => 'palette', 'description' => 'Komunitas desain dan kreatif'],
            ['name' => 'Business', 'slug' => 'business', 'icon' => 'briefcase', 'description' => 'Komunitas bisnis dan entrepreneurship'],
            ['name' => 'Education', 'slug' => 'education', 'icon' => 'book-open', 'description' => 'Komunitas pendidikan dan pembelajaran'],
            ['name' => 'Social', 'slug' => 'social', 'icon' => 'users', 'description' => 'Komunitas sosial dan kemasyarakatan'],
            ['name' => 'Health', 'slug' => 'health', 'icon' => 'heart', 'description' => 'Komunitas kesehatan dan kebugaran'],
            ['name' => 'Environment', 'slug' => 'environment', 'icon' => 'leaf', 'description' => 'Komunitas lingkungan hidup'],
            ['name' => 'Arts', 'slug' => 'arts', 'icon' => 'image', 'description' => 'Komunitas seni dan budaya'],
            ['name' => 'Sports', 'slug' => 'sports', 'icon' => 'zap', 'description' => 'Komunitas olahraga'],
            ['name' => 'Other', 'slug' => 'other', 'icon' => 'grid', 'description' => 'Komunitas lainnya'],
        ];

        foreach ($categories as $category) {
            CommunityCategory::create($category);
        }
    }
}
