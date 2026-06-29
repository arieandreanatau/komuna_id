<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;

class BrandPolicy
{
    public function view(User $user, Brand $brand): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Brand $brand): bool
    {
        return $brand->owner_id === $user->id
            || $user->isAdmin();
    }

    public function delete(User $user, Brand $brand): bool
    {
        return $brand->owner_id === $user->id
            || $user->isAdmin();
    }

    public function approve(User $user, Brand $brand): bool
    {
        return $user->isAdmin();
    }

    public function manageMembers(User $user, Brand $brand): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $brand->members()
            ->where('user_id', $user->id)
            ->whereIn('role', ['owner', 'manager'])
            ->where('status', 'active')
            ->exists();
    }
}
