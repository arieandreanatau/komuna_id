<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\CommunityMember;
use App\Models\EventRegistration;
use App\Models\Notification;
use App\Models\RoleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberDashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('profile', 'roles.role');

        $communitiesCount = CommunityMember::where('user_id', $user->id)
            ->where('status', 'active')
            ->count();

        $eventsCount = EventRegistration::where('user_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->count();

        $ticketsCount = EventRegistration::where('user_id', $user->id)
            ->where('status', 'registered')
            ->count();

        $notificationsUnread = Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        $pendingRoleRequests = RoleRequest::where('user_id', $user->id)
            ->whereIn('status', ['submitted', 'under_review', 'need_revision'])
            ->count();

        $recentCommunities = CommunityMember::with('community')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest('joined_at')
            ->limit(5)
            ->get()
            ->pluck('community');

        $upcomingEvents = EventRegistration::with('event')
            ->where('user_id', $user->id)
            ->where('status', 'registered')
            ->whereHas('event', fn ($q) => $q->where('start_date', '>', now()))
            ->orderBy('registered_at', 'desc')
            ->limit(5)
            ->get()
            ->pluck('event');

        $recentNotifications = Notification::where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        return $this->successResponse([
            'user' => [
                'id' => $user->id,
                'uuid' => $user->uuid,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'name' => $user->full_name ?? $user->username,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'status' => $user->status->value,
                'verification_level' => $user->verification_level,
                'email_verified_at' => $user->email_verified_at,
                'phone_verified_at' => $user->phone_verified_at,
                'identity_verified_at' => $user->identity_verified_at,
                'profile' => $user->profile,
                'roles' => $user->roles->map(fn ($ur) => [
                    'id' => $ur->role->id,
                    'name' => $ur->role->name,
                    'slug' => $ur->role->slug,
                    'scope' => $ur->role->scope,
                    'scope_type' => $ur->scope_type,
                    'scope_id' => $ur->scope_id,
                ]),
            ],
            'communities_count' => $communitiesCount,
            'events_count' => $eventsCount,
            'tickets_count' => $ticketsCount,
            'notifications_unread' => $notificationsUnread,
            'pending_role_requests' => $pendingRoleRequests,
            'recent_communities' => $recentCommunities,
            'upcoming_events' => $upcomingEvents,
            'recent_notifications' => $recentNotifications,
        ]);
    }
}
