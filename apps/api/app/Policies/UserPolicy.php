<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->isAdmin();
    }

    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id || $user->isAdmin();
    }

    public function delete(User $user, User $model): bool
    {
        return $user->isAdmin() && $model->id !== $user->id;
    }

    public function suspend(User $user, User $model): bool
    {
        return $user->isAdmin() && $model->id !== $user->id;
    }

    public function unsuspend(User $user, User $model): bool
    {
        return $user->isAdmin();
    }
}
