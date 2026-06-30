<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Campaign;
use App\Models\Collaboration;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationDashboardController extends Controller
{
    public function __invoke(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $totalBrands = $org->brands()->count();
        $totalTeam = $org->members()->where('status', 'active')->count();
        $totalCampaigns = Campaign::where('organization_id', $organizationId)->count();
        $totalCollaborations = Collaboration::where(function ($q) use ($organizationId) {
            $q->where('sender_type', 'App\\Models\\Organization')
              ->where('sender_id', $organizationId)
              ->orWhere(function ($q2) use ($organizationId) {
                  $q2->where('receiver_type', 'App\\Models\\Organization')
                     ->where('receiver_id', $organizationId);
              });
        })->count();

        $recentActivity = AuditLog::where(function ($q) use ($organizationId) {
            $q->where('auditable_type', 'App\\Models\\Organization')
              ->where('auditable_id', $organizationId)
              ->orWhere(function ($q2) use ($organizationId) {
                  $q2->where('auditable_type', 'App\\Models\\Brand');
              });
        })->latest()->limit(10)->get();

        return $this->successResponse([
            'organization' => [
                'id' => $org->id,
                'name' => $org->name,
                'slug' => $org->slug,
                'status' => $org->status,
                'logo' => $org->logo,
            ],
            'stats' => [
                'total_brands' => $totalBrands,
                'total_team' => $totalTeam,
                'total_campaigns' => $totalCampaigns,
                'total_collaborations' => $totalCollaborations,
            ],
            'recent_activity' => $recentActivity,
        ]);
    }
}
