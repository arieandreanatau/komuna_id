<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    public function view(User $user, Organization $organization): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id
            || $user->isAdmin();
    }

    public function delete(User $user, Organization $organization): bool
    {
        return $organization->owner_id === $user->id
            || $user->isAdmin();
    }

    public function approve(User $user, Organization $organization): bool
    {
        return $user->isAdmin();
    }

    public function manageMembers(User $user, Organization $organization): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $organization->members()
            ->where('user_id', $user->id)
            ->whereIn('role', ['owner', 'admin'])
            ->where('status', 'active')
            ->exists();
    }
}
