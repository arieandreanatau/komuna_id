<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Article $article): bool
    {
        return $article->status === 'published'
            || $article->author_id === $user->id
            || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Article $article): bool
    {
        return $article->author_id === $user->id
            || $user->isAdmin();
    }

    public function delete(User $user, Article $article): bool
    {
        return $article->author_id === $user->id
            || $user->isAdmin();
    }

    public function publish(User $user, Article $article): bool
    {
        return $article->author_id === $user->id
            || $user->isAdmin();
    }
}
