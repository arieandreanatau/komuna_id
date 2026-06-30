<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationNotificationController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('type', 'organization')
            ->where('data->organization_id', $organizationId)
            ->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($notifications);
    }

    public function markRead(Request $request, int $organizationId, int $notificationId): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $notificationId)
            ->firstOrFail();

        $notification->update(['read_at' => now()]);

        return $this->successResponse(null, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request, int $organizationId): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('type', 'organization')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->successResponse(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
