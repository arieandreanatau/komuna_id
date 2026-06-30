<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Community;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Community;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityAuditLogController extends Controller
{
    public function index(Request $request, int $communityId): JsonResponse
    {
        $community = Community::findOrFail($communityId);

        $this->authorize('viewAuditLog', $community);

        $query = AuditLog::with('user:id,name,email')
            ->where(function ($q) use ($communityId) {
                $q->where('auditable_type', 'App\\Models\\Community')
                  ->where('auditable_id', $communityId)
                  ->orWhere(function ($q2) use ($communityId) {
                      $q2->where('auditable_type', 'App\\Models\\CommunityMember')
                         ->where('new_values->community_id', $communityId);
                  })
                  ->orWhere(function ($q2) use ($communityId) {
                      $q2->where('auditable_type', 'App\\Models\\Event')
                         ->where('new_values->community_id', $communityId);
                  });
            });

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $logs = $query->latest()
            ->paginate(min((int) $request->get('per_page', 15), 50));

        return $this->paginatedResponse($logs);
    }
}
