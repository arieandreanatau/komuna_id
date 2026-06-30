<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Notifications\CommunityApprovedNotification;
use App\Notifications\CommunityRejectedNotification;
use App\Notifications\EventRegistrationNotification;
use App\Notifications\InvitationNotification;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\RoleRequestApprovedNotification;
use App\Notifications\RoleRequestRejectedNotification;
use App\Notifications\WelcomeNotification;

class EmailNotificationService
{
    public static function sendWelcome(User $user): void
    {
        $user->notify(new WelcomeNotification($user));
    }

    public static function sendResetPassword(User $user, string $token): void
    {
        $user->notify(new ResetPasswordNotification($user, $token));
    }

    public static function sendRoleApproved(User $user, string $roleName): void
    {
        $user->notify(new RoleRequestApprovedNotification($user, $roleName));
    }

    public static function sendRoleRejected(User $user, string $roleName, ?string $notes = null): void
    {
        $user->notify(new RoleRequestRejectedNotification($user, $roleName, $notes));
    }

    public static function sendInvitation(User $user, string $inviterName, string $roleName, string $token): void
    {
        $user->notify(new InvitationNotification($user, $inviterName, $roleName, $token));
    }

    public static function sendCommunityApproved(User $user, string $communityName): void
    {
        $user->notify(new CommunityApprovedNotification($user, $communityName));
    }

    public static function sendCommunityRejected(User $user, string $communityName, ?string $reason = null): void
    {
        $user->notify(new CommunityRejectedNotification($user, $communityName, $reason));
    }

    public static function sendEventRegistration(User $user, string $eventTitle): void
    {
        $user->notify(new EventRegistrationNotification($user, $eventTitle));
    }
}
