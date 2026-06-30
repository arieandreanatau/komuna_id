<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationAuditLogController extends Controller
{
    public function index(Request $request, int $organizationId): JsonResponse
    {
        $org = Organization::findOrFail($organizationId);

        if ($org->owner_id !== $request->user()->id && !$org->hasMemberRole($request->user()->id, 'admin')) {
            return $this->errorResponse('Tidak memiliki akses', 403);
        }

        $query = AuditLog::with('user:id,name,email')
            ->where(function ($q) use ($organizationId) {
                $q->where('auditable_type', 'App\\Models\\Organization')
                  ->where('auditable_id', $organizationId)
                  ->orWhere(function ($q2) use ($organizationId) {
                      $q2->where('auditable_type', 'App\\Models\\OrganizationMember')
                         ->where('new_values->organization_id', $organizationId);
                  })
                  ->orWhere(function ($q2) use ($organizationId) {
                      $q2->where('auditable_type', 'App\\Models\\Brand')
                         ->where('new_values->organization_id', $organizationId);
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
