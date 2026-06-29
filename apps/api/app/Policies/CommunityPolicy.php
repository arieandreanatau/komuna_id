<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Community;
use App\Models\User;

class CommunityPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Community $community): bool
    {
        return $community->status === 'approved' && $community->is_public
            || $community->owner_id === $user->id
            || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Community $community): bool
    {
        return $community->owner_id === $user->id
            || $user->isAdmin();
    }

    public function delete(User $user, Community $community): bool
    {
        return $community->owner_id === $user->id
            || $user->isAdmin();
    }

    public function approve(User $user, Community $community): bool
    {
        return $user->isAdmin();
    }

    public function manageMembers(User $user, Community $community): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $community->members()
            ->where('user_id', $user->id)
            ->whereIn('role', ['admin', 'moderator'])
            ->where('status', 'active')
            ->exists();
    }
}
