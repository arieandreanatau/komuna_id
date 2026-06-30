<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\Community;
use App\Models\CommunityAnnouncement;
use App\Models\CommunityMember;
use App\Models\Notification;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityNotificationController extends Controller
{
    public function notifications(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewDashboard', $community);

        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('type', 'community')
            ->where('data->community_id', $communityId)
            ->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($notifications);
    }

    public function markRead(Request $request, int $communityId, int $notificationId): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $notificationId)
            ->firstOrFail();

        $notification->update(['read_at' => now()]);

        return $this->successResponse(null, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request, int $communityId): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('type', 'community')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->successResponse(null, 'Semua notifikasi ditandai sudah dibaca');
    }

    public function announcements(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $query = CommunityAnnouncement::with('author:id,full_name,username')
            ->where('community_id', $communityId)
            ->where('status', 'published');

        if (! $request->user()->canManageCommunity($communityId)) {
            $query->latest('is_pinned');
        } else {
            $query->latest('published_at');
        }

        $announcements = $query->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($announcements);
    }

    public function storeAnnouncement(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('createAnnouncement', $community);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_pinned' => 'boolean',
        ]);

        $announcement = CommunityAnnouncement::create([
            'community_id' => $communityId,
            'author_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_pinned' => $validated['is_pinned'] ?? false,
            'status' => 'published',
            'published_at' => now(),
        ]);

        $members = CommunityMember::where('community_id', $communityId)
            ->where('status', 'active')
            ->where('user_id', '!=', $request->user()->id)
            ->pluck('user_id');

        foreach ($members as $memberId) {
            Notification::create([
                'user_id' => $memberId,
                'type' => 'community',
                'title' => 'Pengumuman Baru',
                'message' => 'Pengumuman baru di komunitas '.$community->name.': '.$validated['title'],
                'data' => ['community_id' => $communityId, 'announcement_id' => $announcement->id],
            ]);
        }

        AuditLogService::created($announcement, $request);

        return $this->successResponse($announcement->load('author:id,full_name,username'), 'Pengumuman berhasil dibuat', 201);
    }
}
