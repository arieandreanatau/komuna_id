<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandNotificationController extends Controller
{
    public function index(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && ! $brand->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('type', 'brand')
            ->where('data->brand_id', $brandId)
            ->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($notifications);
    }

    public function markRead(Request $request, int $brandId, int $notificationId): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->where('id', $notificationId)
            ->firstOrFail();

        $notification->update(['read_at' => now()]);

        return $this->successResponse(null, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request, int $brandId): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('type', 'brand')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->successResponse(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
