<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Event $event): bool
    {
        return $event->status === 'published'
            || $event->organizer_id === $user->id
            || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Event $event): bool
    {
        return $event->organizer_id === $user->id
            || $user->isAdmin();
    }

    public function delete(User $user, Event $event): bool
    {
        return $event->organizer_id === $user->id
            || $user->isAdmin();
    }

    public function publish(User $user, Event $event): bool
    {
        return $event->organizer_id === $user->id
            || $user->isAdmin();
    }

    public function checkIn(User $user, Event $event): bool
    {
        return $event->organizer_id === $user->id
            || $user->isAdmin();
    }

    public function register(User $user, Event $event): bool
    {
        return $event->status === 'published';
    }
}
