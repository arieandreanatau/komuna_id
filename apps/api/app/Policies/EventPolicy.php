<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\EventStatus;
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
        if ($event->status === EventStatus::PUBLISHED) {
            return true;
        }

        if ($event->organizer_id === $user->id) {
            return true;
        }

        if ($event->community_id && $user->canManageCommunityEvents($event->community_id)) {
            return true;
        }

        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Event $event): bool
    {
        if ($event->organizer_id === $user->id) {
            return true;
        }

        if ($event->community_id && $user->canManageCommunityEvents($event->community_id)) {
            return true;
        }

        return $user->isAdmin();
    }

    public function delete(User $user, Event $event): bool
    {
        if ($event->organizer_id === $user->id) {
            return true;
        }

        if ($event->community_id && $user->canManageCommunity($event->community_id)) {
            return true;
        }

        return $user->isAdmin();
    }

    public function publish(User $user, Event $event): bool
    {
        if ($event->organizer_id === $user->id) {
            return true;
        }

        if ($event->community_id && $user->canManageCommunityEvents($event->community_id)) {
            return true;
        }

        return $user->isAdmin();
    }

    public function checkIn(User $user, Event $event): bool
    {
        if ($event->organizer_id === $user->id) {
            return true;
        }

        if ($event->community_id && $user->canManageCommunityEvents($event->community_id)) {
            return true;
        }

        return $user->isAdmin();
    }

    public function manageParticipants(User $user, Event $event): bool
    {
        if ($event->organizer_id === $user->id) {
            return true;
        }

        if ($event->community_id && $user->canManageCommunityEvents($event->community_id)) {
            return true;
        }

        return $user->isAdmin();
    }

    public function register(User $user, Event $event): bool
    {
        return $event->status === EventStatus::PUBLISHED;
    }
}
