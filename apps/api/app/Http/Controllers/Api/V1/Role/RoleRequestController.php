<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\ApproveRoleRequest;
use App\Models\RoleRequest;
use App\Models\UserRole;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleRequestController extends Controller
{
    public function approve(ApproveRoleRequest $request, int $id): JsonResponse
    {
        $roleRequest = RoleRequest::findOrFail($id);

        $roleRequest->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'notes' => $request->validated('notes'),
        ]);

        UserRole::create([
            'user_id' => $roleRequest->user_id,
            'role_id' => $roleRequest->role_id,
            'is_active' => true,
        ]);

        AuditLogService::approvalAction('role_request_approved', $roleRequest, $request->validated('notes'), $request);

        return $this->successResponse($roleRequest, 'Permintaan role disetujui');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $roleRequest = RoleRequest::findOrFail($id);

        $roleRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        AuditLogService::approvalAction('role_request_rejected', $roleRequest, null, $request);

        return $this->successResponse($roleRequest, 'Permintaan role ditolak');
    }

    public function needRevision(Request $request, int $id): JsonResponse
    {
        $roleRequest = RoleRequest::findOrFail($id);

        $roleRequest->update([
            'status' => 'revision',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        AuditLogService::approvalAction('role_request_revision', $roleRequest, null, $request);

        return $this->successResponse($roleRequest, 'Permintaan role perlu revisi');
    }
}
