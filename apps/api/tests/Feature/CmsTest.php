<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Faq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_articles(): void
    {
        $user = User::factory()->create();
        Article::factory()->count(3)->create([
            'author_id' => $user->id,
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/v1/articles');

        $response->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_public_can_view_faq(): void
    {
        Faq::factory()->count(3)->create(['is_published' => true]);

        $response = $this->getJson('/api/v1/faqs');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_create_article(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/articles', [
                'title' => 'Test Article',
                'content' => '<p>Article content here</p>',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Test Article');
    }

    public function test_non_author_cannot_update_article(): void
    {
        $author = User::factory()->create();
        $other = User::factory()->create();

        $article = Article::factory()->create([
            'author_id' => $author->id,
            'status' => 'draft',
        ]);

        $token = $other->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/v1/articles/{$article->id}", [
                'title' => 'Hacked Title',
            ]);

        $response->assertStatus(403);
    }
}
