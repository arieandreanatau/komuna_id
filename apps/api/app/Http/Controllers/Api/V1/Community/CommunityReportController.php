<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityReportController extends Controller
{
    public function overview(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewDashboard', $community);

        $totalMembers = $community->members()->where('status', 'active')->count();
        $totalEvents = $community->events()->count();
        $publishedEvents = $community->events()->where('status', 'published')->count();
        $totalParticipants = EventRegistration::whereHas('event', fn ($q) => $q->where('community_id', $communityId))
            ->where('status', '!=', 'cancelled')
            ->count();
        $totalCheckins = EventRegistration::whereHas('event', fn ($q) => $q->where('community_id', $communityId))
            ->where('status', 'checked_in')
            ->count();

        $memberGrowth = CommunityMember::where('community_id', $communityId)
            ->where('status', 'active')
            ->selectRaw('DATE(joined_at) as date, count(*) as count')
            ->where('joined_at', '>=', now()->subMonths(6))
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();

        return $this->successResponse([
            'community' => $community->only(['id', 'name', 'slug']),
            'stats' => [
                'total_members' => $totalMembers,
                'total_events' => $totalEvents,
                'published_events' => $publishedEvents,
                'total_participants' => $totalParticipants,
                'total_checkins' => $totalCheckins,
            ],
            'member_growth' => $memberGrowth,
        ]);
    }

    public function members(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewDashboard', $community);

        $membersByStatus = CommunityMember::where('community_id', $communityId)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $recentJoins = CommunityMember::with('user:id,name')
            ->where('community_id', $communityId)
            ->where('status', 'active')
            ->latest('joined_at')
            ->limit(10)
            ->get();

        return $this->successResponse([
            'members_by_status' => $membersByStatus,
            'recent_joins' => $recentJoins,
        ]);
    }

    public function events(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewDashboard', $community);

        $eventsByStatus = Event::where('community_id', $communityId)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $eventStats = EventRegistration::whereHas('event', fn ($q) => $q->where('community_id', $communityId))
            ->selectRaw('event_id, count(*) as registrations, sum(case when status = "checked_in" then 1 else 0 end) as checkins')
            ->groupBy('event_id')
            ->with('event:id,title,slug')
            ->limit(10)
            ->get();

        return $this->successResponse([
            'events_by_status' => $eventsByStatus,
            'event_stats' => $eventStats,
        ]);
    }

    public function export(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewDashboard', $community);

        $type = $request->get('type', 'members');

        if ($type === 'members') {
            $members = CommunityMember::with('user:id,name,email')
                ->where('community_id', $communityId)
                ->where('status', 'active')
                ->get();

            return $this->successResponse([
                'type' => 'members',
                'data' => $members,
                'count' => $members->count(),
            ]);
        }

        if ($type === 'events') {
            $events = Event::where('community_id', $communityId)
                ->with('registrations')
                ->get();

            return $this->successResponse([
                'type' => 'events',
                'data' => $events,
                'count' => $events->count(),
            ]);
        }

        return $this->errorResponse('Tipe export tidak valid', 422);
    }
}
