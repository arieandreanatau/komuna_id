<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\EventRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityDashboardController extends Controller
{
    public function __invoke(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewDashboard', $community);

        $totalMembers = $community->members()->where('status', 'active')->count();
        $pendingJoinRequests = $community->joinRequests()->where('status', 'pending')->count();
        $totalEvents = $community->events()->count();
        $activeEvents = $community->events()->where('status', 'published')->count();

        $recentMembers = $community->members()
            ->with('user:id,full_name,username,email')
            ->where('status', 'active')
            ->latest('joined_at')
            ->limit(5)
            ->get();

        $recentJoinRequests = $community->joinRequests()
            ->with('user:id,full_name,username,email')
            ->where('status', 'pending')
            ->latest()
            ->limit(5)
            ->get();

        $upcomingEvents = $community->events()
            ->where('status', 'published')
            ->where('start_date', '>', now())
            ->orderBy('start_date')
            ->limit(5)
            ->get();

        $recentEvents = $community->events()
            ->latest()
            ->limit(5)
            ->get();

        $newMembersThisMonth = $community->members()
            ->where('status', 'active')
            ->where('joined_at', '>=', now()->subMonth())
            ->count();

        $eventParticipants = EventRegistration::whereHas('event', fn ($q) => $q->where('community_id', $communityId))
            ->where('status', '!=', 'cancelled')
            ->count();

        $eventCheckins = EventRegistration::whereHas('event', fn ($q) => $q->where('community_id', $communityId))
            ->where('status', 'checked_in')
            ->count();

        return $this->successResponse([
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'slug' => $community->slug,
                'status' => $community->status,
                'logo' => $community->logo,
                'member_count' => $community->member_count,
            ],
            'stats' => [
                'total_members' => $totalMembers,
                'new_members_this_month' => $newMembersThisMonth,
                'pending_join_requests' => $pendingJoinRequests,
                'total_events' => $totalEvents,
                'active_events' => $activeEvents,
                'event_participants' => $eventParticipants,
                'event_checkins' => $eventCheckins,
            ],
            'recent_members' => $recentMembers,
            'recent_join_requests' => $recentJoinRequests,
            'upcoming_events' => $upcomingEvents,
            'recent_events' => $recentEvents,
        ]);
    }
}
