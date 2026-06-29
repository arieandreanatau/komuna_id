<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $roles = Role::with('permissions')
            ->where('is_active', true)
            ->get();

        return $this->successResponse($roles);
    }

    public function permissions(Request $request): JsonResponse
    {
        $permissions = Permission::all()->groupBy('group');

        return $this->successResponse($permissions);
    }
}
