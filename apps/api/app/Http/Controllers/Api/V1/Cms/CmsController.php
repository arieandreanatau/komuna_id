<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Cms;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\Faq;
use App\Models\Page;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CmsController extends Controller
{
    // --- Articles ---

    public function articles(Request $request): JsonResponse
    {
        $query = Article::with(['author', 'category']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', ArticleStatus::PUBLISHED);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $articles = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($articles);
    }

    public function article(string $slug): JsonResponse
    {
        $article = Article::with(['author', 'category'])
            ->where('slug', $slug)
            ->where('status', ArticleStatus::PUBLISHED)
            ->firstOrFail();

        return $this->successResponse($article);
    }

    public function storeArticle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:1000',
            'category_id' => 'nullable|exists:article_categories,id',
            'cover_image' => 'nullable|image|max:2048',
        ]);

        $article = Article::create([
            ...$validated,
            'slug' => Str::slug($validated['title']),
            'author_id' => $request->user()->id,
            'status' => ArticleStatus::DRAFT,
        ]);

        AuditLogService::created($article, $request);

        return $this->successResponse($article, 'Artikel berhasil dibuat', 201);
    }

    public function updateArticle(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        if ($article->author_id !== $request->user()->id) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string|max:1000',
            'category_id' => 'nullable|exists:article_categories,id',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $oldValues = $article->only(array_keys($validated));
        $article->update($validated);

        AuditLogService::updated($article, $oldValues, $request);

        return $this->successResponse($article->fresh(), 'Artikel berhasil diperbarui');
    }

    public function submitArticleReview(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => ArticleStatus::PENDING_REVIEW]);
        AuditLogService::approvalAction('submitted_for_review', $article, null, $request);
        return $this->successResponse($article, 'Artikel dikirim untuk review');
    }

    public function publishArticle(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->update([
            'status' => ArticleStatus::PUBLISHED,
            'published_at' => now(),
        ]);
        AuditLogService::approvalAction('published', $article, null, $request);
        return $this->successResponse($article, 'Artikel dipublikasikan');
    }

    public function unpublishArticle(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => ArticleStatus::UNPUBLISHED]);
        AuditLogService::approvalAction('unpublished', $article, null, $request);
        return $this->successResponse($article, 'Artikel tidak dipublikasikan');
    }

    public function archiveArticle(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->update(['status' => ArticleStatus::ARCHIVED]);
        AuditLogService::approvalAction('archived', $article, null, $request);
        return $this->successResponse($article, 'Artikel diarsipkan');
    }

    // --- Pages ---

    public function page(string $slug): JsonResponse
    {
        $page = Page::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return $this->successResponse($page);
    }

    // --- FAQs ---

    public function faqs(): JsonResponse
    {
        $faqs = Faq::where('is_published', true)
            ->orderBy('sort_order')
            ->get();

        return $this->successResponse($faqs);
    }

    // --- Article Categories ---

    public function articleCategories(): JsonResponse
    {
        $categories = ArticleCategory::where('is_active', true)->get();
        return $this->successResponse($categories);
    }
}
