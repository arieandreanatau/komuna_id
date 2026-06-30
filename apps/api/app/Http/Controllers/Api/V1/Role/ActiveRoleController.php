<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\SwitchRoleRequest;
use App\Models\Brand;
use App\Models\BrandMember;
use App\Models\Organization;
use App\Models\OrganizationMember;
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

    public function identities(Request $request): JsonResponse
    {
        $user = $request->user();
        $identities = [];

        $identities[] = [
            'type' => 'member',
            'label' => 'Member Dashboard',
            'scope_id' => null,
        ];

        $orgIds = OrganizationMember::where('user_id', $user->id)
            ->where('status', 'active')
            ->pluck('organization_id')
            ->unique();

        foreach ($orgIds as $orgId) {
            $org = Organization::find($orgId);
            if ($org) {
                $member = OrganizationMember::where('organization_id', $orgId)
                    ->where('user_id', $user->id)
                    ->where('status', 'active')
                    ->first();
                $identities[] = [
                    'type' => 'organization',
                    'label' => $org->name,
                    'scope_id' => $org->id,
                    'role' => $member?->role,
                ];
            }
        }

        $brandIds = BrandMember::where('user_id', $user->id)
            ->where('status', 'active')
            ->pluck('brand_id')
            ->unique();

        foreach ($brandIds as $brandId) {
            $brand = Brand::find($brandId);
            if ($brand) {
                $member = BrandMember::where('brand_id', $brandId)
                    ->where('user_id', $user->id)
                    ->where('status', 'active')
                    ->first();
                $identities[] = [
                    'type' => 'brand',
                    'label' => $brand->name,
                    'scope_id' => $brand->id,
                    'role' => $member?->role,
                ];
            }
        }

        return $this->successResponse($identities);
    }
}
