<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Campaign;
use App\Models\Collaboration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandDashboardController extends Controller
{
    public function __invoke(Request $request, int $brandId): JsonResponse
    {
        $brand = Brand::findOrFail($brandId);

        if ($brand->owner_id !== $request->user()->id && !$brand->hasMemberRole($request->user()->id, 'admin', 'manager')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $totalTeam = $brand->members()->where('status', 'active')->count();
        $totalCampaigns = $brand->campaigns()->count();
        $activeCampaigns = $brand->campaigns()->where('status', 'active')->count();
        $totalCollaborations = Collaboration::where('sender_type', 'App\\Models\\Brand')
            ->where('sender_id', $brandId)
            ->orWhere('receiver_type', 'App\\Models\\Brand')
            ->where('receiver_id', $brandId)
            ->count();

        $recentActivity = \App\Models\AuditLog::where(function ($q) use ($brandId) {
            $q->where('auditable_type', 'App\\Models\\Brand')
              ->where('auditable_id', $brandId)
              ->orWhere(function ($q2) use ($brandId) {
                  $q2->where('auditable_type', 'App\\Models\\Campaign')
                     ->where('new_values->brand_id', $brandId);
              });
        })->latest()->limit(10)->get();

        return $this->successResponse([
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'status' => $brand->status,
                'logo' => $brand->logo,
            ],
            'stats' => [
                'total_team' => $totalTeam,
                'total_campaigns' => $totalCampaigns,
                'active_campaigns' => $activeCampaigns,
                'total_collaborations' => $totalCollaborations,
            ],
            'recent_activity' => $recentActivity,
        ]);
    }
}
