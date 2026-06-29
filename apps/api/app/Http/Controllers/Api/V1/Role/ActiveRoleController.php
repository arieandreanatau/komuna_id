<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\SwitchRoleRequest;
use App\Models\UserRole;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;

class ActiveRoleController extends Controller
{
    public function switch(SwitchRoleRequest $request): JsonResponse
    {
        $userRoleId = $request->validated('user_role_id');

        $userRole = UserRole::where('id', $userRoleId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        UserRole::where('user_id', $request->user()->id)
            ->update(['is_active' => false]);

        $userRole->update(['is_active' => true]);

        AuditLogService::roleChange(
            $request->user()->id,
            'role_switched',
            null,
            ['user_role_id' => $userRole->id, 'role_id' => $userRole->role_id],
            $request
        );

        return $this->successResponse($userRole->fresh()->load('role'), 'Role aktif berhasil diubah');
    }
}
