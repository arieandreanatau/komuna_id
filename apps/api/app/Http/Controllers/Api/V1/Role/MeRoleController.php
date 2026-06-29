<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\RequestRoleRequest;
use App\Models\RoleRequest;
use App\Models\UserRole;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeRoleController extends Controller
{
    public function roles(Request $request): JsonResponse
    {
        $roles = UserRole::with('role')
            ->where('user_id', $request->user()->id)
            ->get();

        return $this->successResponse($roles);
    }

    public function requestRole(RequestRoleRequest $request): JsonResponse
    {
        $roleRequest = RoleRequest::create([
            'user_id' => $request->user()->id,
            'role_id' => $request->validated('role_id'),
            'status' => 'pending',
        ]);

        AuditLogService::created($roleRequest, $request);

        return $this->successResponse($roleRequest, 'Permintaan role berhasil dibuat', 201);
    }

    public function roleRequests(Request $request): JsonResponse
    {
        $roleRequests = RoleRequest::with('role')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($roleRequests);
    }
}
