<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Collaboration;
use App\Models\User;

class CollaborationPolicy
{
    public function view(User $user, Collaboration $collaboration): bool
    {
        return $collaboration->sender_id === $user->id
            || $collaboration->receiver_id === $user->id
            || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Collaboration $collaboration): bool
    {
        return $collaboration->sender_id === $user->id
            || $collaboration->receiver_id === $user->id
            || $user->isAdmin();
    }

    public function manage(User $user, Collaboration $collaboration): bool
    {
        return $collaboration->sender_id === $user->id
            || $collaboration->receiver_id === $user->id
            || $user->isAdmin();
    }
}
