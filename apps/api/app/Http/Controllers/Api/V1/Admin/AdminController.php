<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\ApprovalStatus;
use App\Enums\CommunityStatus;
use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\AuditLog;
use App\Models\Brand;
use App\Models\Collaboration;
use App\Models\Community;
use App\Models\Event;
use App\Models\Organization;
use App\Models\RoleRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        return $this->successResponse([
            'stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'total_communities' => Community::count(),
                'pending_communities' => Community::where('status', CommunityStatus::PENDING_REVIEW)->count(),
                'total_events' => Event::count(),
                'published_events' => Event::where('status', EventStatus::PUBLISHED)->count(),
                'total_organizations' => Organization::count(),
                'pending_organizations' => Organization::where('status', ApprovalStatus::PENDING)->count(),
                'total_brands' => Brand::count(),
                'pending_brands' => Brand::where('status', ApprovalStatus::PENDING)->count(),
                'total_collaborations' => Collaboration::count(),
                'pending_role_requests' => RoleRequest::where('status', 'pending')->count(),
                'total_articles' => Article::count(),
            ],
            'recent_users' => User::latest()->limit(5)->get(['id', 'name', 'email', 'status', 'created_at']),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::with('profile');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($users);
    }

    public function roleRequests(Request $request): JsonResponse
    {
        $query = RoleRequest::with(['user', 'role']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($requests);
    }

    public function communities(Request $request): JsonResponse
    {
        $query = Community::with(['category', 'owner']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $communities = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($communities);
    }

    public function organizations(Request $request): JsonResponse
    {
        $query = Organization::with(['owner']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $organizations = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($organizations);
    }

    public function brands(Request $request): JsonResponse
    {
        $query = Brand::with(['owner', 'organization']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $brands = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($brands);
    }

    public function events(Request $request): JsonResponse
    {
        $query = Event::with(['community', 'organizer']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $events = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($events);
    }

    public function collaborations(Request $request): JsonResponse
    {
        $query = Collaboration::with(['sender', 'receiver']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $collabs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($collabs);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $query = AuditLog::with('user');

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('auditable_type')) {
            $query->where('auditable_type', $request->auditable_type);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('from_date')) {
            $query->where('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('created_at', '<=', $request->to_date);
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($logs);
    }

    public function reports(Request $request): JsonResponse
    {
        $period = $request->get('period', 'monthly');

        $userGrowth = User::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )->groupBy('date')->orderBy('date', 'desc')->limit(30)->get();

        $communityByStatus = Community::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')->get();

        $eventByStatus = Event::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')->get();

        return $this->successResponse([
            'user_growth' => $userGrowth,
            'community_by_status' => $communityByStatus,
            'event_by_status' => $eventByStatus,
        ]);
    }
}
