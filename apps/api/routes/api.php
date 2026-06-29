<?php

use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Brand\BrandController;
use App\Http\Controllers\Api\V1\Collaboration\CollaborationController;
use App\Http\Controllers\Api\V1\Community\CommunityController;
use App\Http\Controllers\Api\V1\Cms\CmsController;
use App\Http\Controllers\Api\V1\Event\EventController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\Organization\OrganizationController;
use App\Http\Controllers\Api\V1\Role\RoleController;
use App\Http\Controllers\Api\V1\Role\MeRoleController;
use App\Http\Controllers\Api\V1\Role\RoleRequestController;
use App\Http\Controllers\Api\V1\Role\InvitationController;
use App\Http\Controllers\Api\V1\Role\ActiveRoleController;
use App\Http\Controllers\Api\V1\UploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', [HealthController::class, 'index']);

    // Auth Routes (Public) with rate limiting
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])
            ->middleware('throttle:register');
        Route::post('/login', [AuthController::class, 'login'])
            ->middleware('throttle:login');
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->middleware('throttle:5,1');
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        Route::post('/email/verify', [AuthController::class, 'verifyEmail'])->middleware('signed');
        Route::post('/email/resend', [AuthController::class, 'resendVerification'])
            ->middleware('throttle:3,1');
    });

    // Public Content
    Route::get('/communities', [CommunityController::class, 'index']);
    Route::get('/communities/categories', [CommunityController::class, 'categories']);
    Route::get('/communities/{slug}', [CommunityController::class, 'show']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);
    Route::get('/articles', [CmsController::class, 'articles']);
    Route::get('/articles/{slug}', [CmsController::class, 'article']);
    Route::get('/article-categories', [CmsController::class, 'articleCategories']);
    Route::get('/pages/{slug}', [CmsController::class, 'page']);
    Route::get('/faqs', [CmsController::class, 'faqs']);

    // RBAC Public
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/permissions', [RoleController::class, 'permissions']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'changePassword']);
        });

        // Community (Protected)
        Route::post('/communities', [CommunityController::class, 'store']);
        Route::put('/communities/{id}', [CommunityController::class, 'update']);
        Route::post('/communities/{id}/submit-review', [CommunityController::class, 'submitReview']);
        Route::post('/communities/{id}/approve', [CommunityController::class, 'approve'])->middleware('admin');
        Route::post('/communities/{id}/reject', [CommunityController::class, 'reject'])->middleware('admin');
        Route::post('/communities/{id}/need-revision', [CommunityController::class, 'needRevision'])->middleware('admin');
        Route::post('/communities/{id}/archive', [CommunityController::class, 'archive']);
        Route::post('/communities/{id}/join', [CommunityController::class, 'join']);
        Route::post('/communities/{id}/leave', [CommunityController::class, 'leave']);
        Route::get('/communities/{id}/members', [CommunityController::class, 'members']);
        Route::post('/communities/{communityId}/members/{userId}/approve', [CommunityController::class, 'approveMember']);
        Route::post('/communities/{communityId}/members/{userId}/reject', [CommunityController::class, 'rejectMember']);
        Route::post('/communities/{communityId}/members/{userId}/ban', [CommunityController::class, 'banMember']);

        // Event (Protected)
        Route::post('/communities/{communityId}/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::post('/events/{id}/publish', [EventController::class, 'publish']);
        Route::post('/events/{id}/cancel', [EventController::class, 'cancel']);
        Route::post('/events/{id}/archive', [EventController::class, 'archive']);
        Route::post('/events/{id}/register', [EventController::class, 'register']);
        Route::get('/me/tickets', [EventController::class, 'myTickets']);
        Route::post('/events/{id}/check-in', [EventController::class, 'checkIn']);
        Route::get('/events/{id}/report', [EventController::class, 'report']);

        // Organization (Protected)
        Route::post('/organizations', [OrganizationController::class, 'store']);
        Route::get('/organizations/{id}', [OrganizationController::class, 'show']);
        Route::put('/organizations/{id}', [OrganizationController::class, 'update']);
        Route::post('/organizations/{id}/submit-review', [OrganizationController::class, 'submitReview']);
        Route::post('/organizations/{id}/approve', [OrganizationController::class, 'approve'])->middleware('admin');
        Route::post('/organizations/{id}/reject', [OrganizationController::class, 'reject'])->middleware('admin');
        Route::post('/organizations/{id}/need-revision', [OrganizationController::class, 'needRevision'])->middleware('admin');
        Route::post('/organizations/{id}/archive', [OrganizationController::class, 'archive']);
        Route::get('/organizations/{id}/members', [OrganizationController::class, 'members']);

        // Brand (Protected)
        Route::post('/brands', [BrandController::class, 'store']);
        Route::get('/brands/{id}', [BrandController::class, 'show']);
        Route::put('/brands/{id}', [BrandController::class, 'update']);
        Route::post('/brands/{id}/submit-review', [BrandController::class, 'submitReview']);
        Route::post('/brands/{id}/approve', [BrandController::class, 'approve'])->middleware('admin');
        Route::post('/brands/{id}/reject', [BrandController::class, 'reject'])->middleware('admin');
        Route::post('/brands/{id}/need-revision', [BrandController::class, 'needRevision'])->middleware('admin');
        Route::post('/brands/{id}/archive', [BrandController::class, 'archive']);
        Route::get('/brands/{id}/members', [BrandController::class, 'members']);

        // Collaboration (Protected)
        Route::get('/collaborations', [CollaborationController::class, 'index']);
        Route::post('/collaborations', [CollaborationController::class, 'store']);
        Route::get('/collaborations/{id}', [CollaborationController::class, 'show']);
        Route::put('/collaborations/{id}', [CollaborationController::class, 'update']);
        Route::post('/collaborations/{id}/accept', [CollaborationController::class, 'accept']);
        Route::post('/collaborations/{id}/reject', [CollaborationController::class, 'reject']);
        Route::post('/collaborations/{id}/request-revision', [CollaborationController::class, 'requestRevision']);
        Route::post('/collaborations/{id}/start', [CollaborationController::class, 'start']);
        Route::post('/collaborations/{id}/complete', [CollaborationController::class, 'complete']);
        Route::post('/collaborations/{id}/archive', [CollaborationController::class, 'archive']);
        Route::get('/collaborations/{id}/deliverables', [CollaborationController::class, 'deliverables']);
        Route::post('/collaborations/{id}/deliverables', [CollaborationController::class, 'storeDeliverable']);

        // CMS (Protected)
        Route::post('/articles', [CmsController::class, 'storeArticle']);
        Route::put('/articles/{id}', [CmsController::class, 'updateArticle']);
        Route::post('/articles/{id}/submit-review', [CmsController::class, 'submitArticleReview']);
        Route::post('/articles/{id}/publish', [CmsController::class, 'publishArticle']);
        Route::post('/articles/{id}/unpublish', [CmsController::class, 'unpublishArticle']);
        Route::post('/articles/{id}/archive', [CmsController::class, 'archiveArticle']);

        // My Roles
        Route::get('/me/roles', [MeRoleController::class, 'roles']);
        Route::post('/me/role-requests', [MeRoleController::class, 'requestRole']);
        Route::get('/me/role-requests', [MeRoleController::class, 'roleRequests']);
        Route::post('/me/active-role', [ActiveRoleController::class, 'switch']);

        // Role Requests (Admin)
        Route::post('/role-requests/{id}/approve', [RoleRequestController::class, 'approve'])->middleware('admin');
        Route::post('/role-requests/{id}/reject', [RoleRequestController::class, 'reject'])->middleware('admin');
        Route::post('/role-requests/{id}/need-revision', [RoleRequestController::class, 'needRevision'])->middleware('admin');

        // Invitations
        Route::post('/invitations', [InvitationController::class, 'store']);
        Route::post('/invitations/{token}/accept', [InvitationController::class, 'accept']);
        Route::post('/invitations/{token}/reject', [InvitationController::class, 'reject']);

        // Upload
        Route::post('/upload', [UploadController::class, 'store']);
        Route::delete('/upload', [UploadController::class, 'destroy']);

        // Admin (Protected + Admin middleware)
        Route::prefix('admin')->middleware(['admin'])->group(function () {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::get('/role-requests', [AdminController::class, 'roleRequests']);
            Route::get('/communities', [AdminController::class, 'communities']);
            Route::get('/organizations', [AdminController::class, 'organizations']);
            Route::get('/brands', [AdminController::class, 'brands']);
            Route::get('/events', [AdminController::class, 'events']);
            Route::get('/collaborations', [AdminController::class, 'collaborations']);
            Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
            Route::get('/reports', [AdminController::class, 'reports']);
        });
    });
});
