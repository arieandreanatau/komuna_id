<?php

use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Brand\BrandAuditLogController;
use App\Http\Controllers\Api\V1\Brand\BrandController;
use App\Http\Controllers\Api\V1\Brand\BrandDashboardController;
use App\Http\Controllers\Api\V1\Brand\BrandDocumentController;
use App\Http\Controllers\Api\V1\Brand\BrandNotificationController;
use App\Http\Controllers\Api\V1\Brand\BrandPlaceholderController;
use App\Http\Controllers\Api\V1\Brand\BrandProfileController;
use App\Http\Controllers\Api\V1\Brand\BrandRoleController;
use App\Http\Controllers\Api\V1\Brand\BrandSettingsController;
use App\Http\Controllers\Api\V1\Brand\BrandTeamController;
use App\Http\Controllers\Api\V1\Cms\CmsController;
use App\Http\Controllers\Api\V1\Collaboration\CollaborationController;
use App\Http\Controllers\Api\V1\Community\CommunityAuditLogController;
use App\Http\Controllers\Api\V1\Community\CommunityController;
use App\Http\Controllers\Api\V1\Community\CommunityDashboardController;
use App\Http\Controllers\Api\V1\Community\CommunityEventController;
use App\Http\Controllers\Api\V1\Community\CommunityMemberController;
use App\Http\Controllers\Api\V1\Community\CommunityNotificationController;
use App\Http\Controllers\Api\V1\Community\CommunityPlaceholderController;
use App\Http\Controllers\Api\V1\Community\CommunityProfileController;
use App\Http\Controllers\Api\V1\Community\CommunityReportController;
use App\Http\Controllers\Api\V1\Community\CommunityRoleController;
use App\Http\Controllers\Api\V1\Community\CommunitySettingsController;
use App\Http\Controllers\Api\V1\Event\EventController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\Member\ChatController;
use App\Http\Controllers\Api\V1\Member\FavoriteController;
use App\Http\Controllers\Api\V1\Member\MemberDashboardController;
use App\Http\Controllers\Api\V1\Member\NotificationController;
use App\Http\Controllers\Api\V1\Member\ProductController;
use App\Http\Controllers\Api\V1\Member\ReportController;
use App\Http\Controllers\Api\V1\Member\VolunteerController;
use App\Http\Controllers\Api\V1\Member\WalletController;
use App\Http\Controllers\Api\V1\NotificationController as MeNotificationController;
use App\Http\Controllers\Api\V1\Organization\OrganizationAuditLogController;
use App\Http\Controllers\Api\V1\Organization\OrganizationBrandController;
use App\Http\Controllers\Api\V1\Organization\OrganizationController;
use App\Http\Controllers\Api\V1\Organization\OrganizationDashboardController;
use App\Http\Controllers\Api\V1\Organization\OrganizationDocumentController;
use App\Http\Controllers\Api\V1\Organization\OrganizationNotificationController;
use App\Http\Controllers\Api\V1\Organization\OrganizationPlaceholderController;
use App\Http\Controllers\Api\V1\Organization\OrganizationProfileController;
use App\Http\Controllers\Api\V1\Organization\OrganizationRoleController;
use App\Http\Controllers\Api\V1\Organization\OrganizationSettingsController;
use App\Http\Controllers\Api\V1\Organization\OrganizationTeamController;
use App\Http\Controllers\Api\V1\Role\ActiveRoleController;
use App\Http\Controllers\Api\V1\Role\InvitationController;
use App\Http\Controllers\Api\V1\Role\MeRoleController;
use App\Http\Controllers\Api\V1\Role\RoleController;
use App\Http\Controllers\Api\V1\Role\RoleRequestController;
use App\Http\Controllers\Api\V1\UploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/health', [HealthController::class, 'index']);

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
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/permissions', [RoleController::class, 'permissions']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'changePassword']);
        });

        Route::post('/communities', [CommunityController::class, 'store']);
        Route::get('/me/communities', [CommunityController::class, 'myCommunities']);
        Route::put('/communities/{id}', [CommunityController::class, 'update']);
        Route::post('/communities/{id}/submit-review', [CommunityController::class, 'submitReview']);
        Route::post('/communities/{id}/approve', [CommunityController::class, 'approve'])->middleware('admin');
        Route::post('/communities/{id}/reject', [CommunityController::class, 'reject'])->middleware('admin');
        Route::post('/communities/{id}/need-revision', [CommunityController::class, 'needRevision'])->middleware('admin');
        Route::post('/communities/{id}/archive', [CommunityController::class, 'archive']);
        Route::post('/communities/{id}/join', [CommunityController::class, 'join']);
        Route::post('/communities/{id}/leave', [CommunityController::class, 'leave']);

        Route::prefix('communities/{communityId}')->middleware('community-role')->group(function () {

            Route::get('/dashboard', CommunityDashboardController::class);

            Route::get('/profile', [CommunityProfileController::class, 'show']);
            Route::put('/profile', [CommunityProfileController::class, 'update']);
            Route::post('/profile/logo', [CommunityProfileController::class, 'updateLogo']);
            Route::post('/profile/cover', [CommunityProfileController::class, 'updateCoverImage']);
            Route::post('/archive', [CommunityProfileController::class, 'archive']);
            Route::post('/delete-request', [CommunityProfileController::class, 'deleteRequest']);

            Route::get('/settings', [CommunitySettingsController::class, 'index']);
            Route::put('/settings', [CommunitySettingsController::class, 'update']);

            Route::get('/members', [CommunityMemberController::class, 'index']);
            Route::get('/members/history', [CommunityMemberController::class, 'history']);
            Route::get('/members/{memberId}', [CommunityMemberController::class, 'show']);
            Route::delete('/members/{memberId}', [CommunityMemberController::class, 'remove']);
            Route::post('/members/{memberId}/ban', [CommunityMemberController::class, 'ban']);
            Route::post('/members/{memberId}/unban', [CommunityMemberController::class, 'unban']);

            Route::get('/join-requests', [CommunityMemberController::class, 'joinRequests']);
            Route::post('/join-requests/{requestId}/approve', [CommunityMemberController::class, 'approveJoinRequest']);
            Route::post('/join-requests/{requestId}/reject', [CommunityMemberController::class, 'rejectJoinRequest']);

            Route::get('/roles', [CommunityRoleController::class, 'index']);
            Route::post('/roles', [CommunityRoleController::class, 'store']);
            Route::put('/roles/{assignmentId}', [CommunityRoleController::class, 'update']);
            Route::delete('/roles/{assignmentId}', [CommunityRoleController::class, 'destroy']);
            Route::get('/role-history', [CommunityRoleController::class, 'history']);

            Route::get('/events', [CommunityEventController::class, 'index']);
            Route::post('/events', [CommunityEventController::class, 'store']);
            Route::get('/events/{eventId}', [CommunityEventController::class, 'show']);
            Route::put('/events/{eventId}', [CommunityEventController::class, 'update']);
            Route::post('/events/{eventId}/publish', [CommunityEventController::class, 'publish']);
            Route::post('/events/{eventId}/cancel', [CommunityEventController::class, 'cancel']);
            Route::post('/events/{eventId}/archive', [CommunityEventController::class, 'archive']);
            Route::get('/events/{eventId}/participants', [CommunityEventController::class, 'participants']);
            Route::post('/events/{eventId}/participants/{participantId}/approve', [CommunityEventController::class, 'approveParticipant']);
            Route::post('/events/{eventId}/participants/{participantId}/reject', [CommunityEventController::class, 'rejectParticipant']);
            Route::post('/events/{eventId}/checkin', [CommunityEventController::class, 'checkin']);
            Route::get('/events/{eventId}/checkins', [CommunityEventController::class, 'checkins']);
            Route::get('/events/{eventId}/report', [CommunityEventController::class, 'report']);

            Route::get('/reports/overview', [CommunityReportController::class, 'overview']);
            Route::get('/reports/members', [CommunityReportController::class, 'members']);
            Route::get('/reports/events', [CommunityReportController::class, 'events']);
            Route::post('/reports/export', [CommunityReportController::class, 'export']);

            Route::get('/notifications', [CommunityNotificationController::class, 'notifications']);
            Route::post('/notifications/{notificationId}/read', [CommunityNotificationController::class, 'markRead']);
            Route::post('/notifications/read-all', [CommunityNotificationController::class, 'markAllRead']);
            Route::get('/announcements', [CommunityNotificationController::class, 'announcements']);
            Route::post('/announcements', [CommunityNotificationController::class, 'storeAnnouncement']);

            Route::get('/audit-logs', [CommunityAuditLogController::class, 'index']);

            Route::get('/sub-communities', [CommunityPlaceholderController::class, 'subCommunities']);
            Route::get('/regions', [CommunityPlaceholderController::class, 'regions']);
            Route::get('/discussions', [CommunityPlaceholderController::class, 'discussions']);
            Route::get('/volunteers', [CommunityPlaceholderController::class, 'volunteers']);
            Route::get('/collaborations', [CommunityPlaceholderController::class, 'collaborations']);
            Route::get('/finance', [CommunityPlaceholderController::class, 'finance']);
            Route::get('/marketplace', [CommunityPlaceholderController::class, 'marketplace']);
            Route::get('/media', [CommunityPlaceholderController::class, 'media']);
        });

        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::post('/events/{id}/publish', [EventController::class, 'publish']);
        Route::post('/events/{id}/cancel', [EventController::class, 'cancel']);
        Route::post('/events/{id}/archive', [EventController::class, 'archive']);
        Route::post('/events/{id}/register', [EventController::class, 'register']);
        Route::post('/events/{id}/cancel-registration', [EventController::class, 'cancelRegistration']);
        Route::get('/me/tickets', [EventController::class, 'myTickets']);
        Route::get('/me/events', [EventController::class, 'myEvents']);
        Route::post('/events/{id}/check-in', [EventController::class, 'checkIn']);
        Route::get('/events/{id}/report', [EventController::class, 'report']);
        Route::get('/events/{id}/ticket', [EventController::class, 'ticket']);

        Route::post('/organizations', [OrganizationController::class, 'store']);
        Route::get('/organizations/{id}', [OrganizationController::class, 'show']);
        Route::put('/organizations/{id}', [OrganizationController::class, 'update']);
        Route::post('/organizations/{id}/submit-review', [OrganizationController::class, 'submitReview']);
        Route::post('/organizations/{id}/approve', [OrganizationController::class, 'approve'])->middleware('admin');
        Route::post('/organizations/{id}/reject', [OrganizationController::class, 'reject'])->middleware('admin');
        Route::post('/organizations/{id}/need-revision', [OrganizationController::class, 'needRevision'])->middleware('admin');
        Route::post('/organizations/{id}/archive', [OrganizationController::class, 'archive']);
        Route::get('/organizations/{id}/members', [OrganizationController::class, 'members']);

        Route::prefix('organizations/{organizationId}')->middleware('org-role')->group(function () {
            Route::get('/dashboard', OrganizationDashboardController::class);

            Route::get('/profile', [OrganizationProfileController::class, 'show']);
            Route::put('/profile', [OrganizationProfileController::class, 'update']);
            Route::post('/profile/logo', [OrganizationProfileController::class, 'updateLogo']);
            Route::post('/archive', [OrganizationProfileController::class, 'archive']);
            Route::post('/delete-request', [OrganizationProfileController::class, 'deleteRequest']);

            Route::get('/team', [OrganizationTeamController::class, 'index']);
            Route::get('/team/{memberId}', [OrganizationTeamController::class, 'show']);
            Route::delete('/team/{memberId}', [OrganizationTeamController::class, 'remove']);

            Route::get('/roles', [OrganizationRoleController::class, 'index']);
            Route::post('/roles', [OrganizationRoleController::class, 'store']);
            Route::put('/roles/{memberId}', [OrganizationRoleController::class, 'update']);
            Route::delete('/roles/{memberId}', [OrganizationRoleController::class, 'destroy']);
            Route::get('/role-history', [OrganizationRoleController::class, 'history']);

            Route::get('/brands', [OrganizationBrandController::class, 'index']);
            Route::post('/brands', [OrganizationBrandController::class, 'store']);
            Route::get('/brands/{brandId}', [OrganizationBrandController::class, 'show']);
            Route::put('/brands/{brandId}', [OrganizationBrandController::class, 'update']);
            Route::post('/brands/{brandId}/archive', [OrganizationBrandController::class, 'archive']);

            Route::get('/documents', [OrganizationDocumentController::class, 'index']);
            Route::post('/documents', [OrganizationDocumentController::class, 'store']);
            Route::delete('/documents/{documentId}', [OrganizationDocumentController::class, 'destroy']);

            Route::get('/settings', [OrganizationSettingsController::class, 'index']);
            Route::put('/settings', [OrganizationSettingsController::class, 'update']);

            Route::get('/notifications', [OrganizationNotificationController::class, 'index']);
            Route::post('/notifications/{notificationId}/read', [OrganizationNotificationController::class, 'markRead']);
            Route::post('/notifications/read-all', [OrganizationNotificationController::class, 'markAllRead']);

            Route::get('/audit-logs', [OrganizationAuditLogController::class, 'index']);

            Route::get('/finance', [OrganizationPlaceholderController::class, 'finance']);
            Route::get('/marketplace', [OrganizationPlaceholderController::class, 'marketplace']);
            Route::get('/sponsorship', [OrganizationPlaceholderController::class, 'sponsorship']);
            Route::get('/events', [OrganizationPlaceholderController::class, 'events']);
        });

        Route::post('/brands', [BrandController::class, 'store']);
        Route::get('/brands/{id}', [BrandController::class, 'show']);
        Route::put('/brands/{id}', [BrandController::class, 'update']);
        Route::post('/brands/{id}/submit-review', [BrandController::class, 'submitReview']);
        Route::post('/brands/{id}/approve', [BrandController::class, 'approve'])->middleware('admin');
        Route::post('/brands/{id}/reject', [BrandController::class, 'reject'])->middleware('admin');
        Route::post('/brands/{id}/need-revision', [BrandController::class, 'needRevision'])->middleware('admin');
        Route::post('/brands/{id}/archive', [BrandController::class, 'archive']);
        Route::get('/brands/{id}/members', [BrandController::class, 'members']);

        Route::prefix('brands/{brandId}')->middleware('brand-role')->group(function () {
            Route::get('/dashboard', BrandDashboardController::class);

            Route::get('/profile', [BrandProfileController::class, 'show']);
            Route::put('/profile', [BrandProfileController::class, 'update']);
            Route::post('/profile/logo', [BrandProfileController::class, 'updateLogo']);
            Route::post('/profile/banner', [BrandProfileController::class, 'updateBanner']);
            Route::post('/archive', [BrandProfileController::class, 'archive']);
            Route::post('/delete-request', [BrandProfileController::class, 'deleteRequest']);

            Route::get('/team', [BrandTeamController::class, 'index']);
            Route::get('/team/{memberId}', [BrandTeamController::class, 'show']);
            Route::delete('/team/{memberId}', [BrandTeamController::class, 'remove']);

            Route::get('/roles', [BrandRoleController::class, 'index']);
            Route::post('/roles', [BrandRoleController::class, 'store']);
            Route::put('/roles/{memberId}', [BrandRoleController::class, 'update']);
            Route::delete('/roles/{memberId}', [BrandRoleController::class, 'destroy']);
            Route::get('/role-history', [BrandRoleController::class, 'history']);

            Route::get('/documents', [BrandDocumentController::class, 'index']);
            Route::post('/documents', [BrandDocumentController::class, 'store']);
            Route::delete('/documents/{documentId}', [BrandDocumentController::class, 'destroy']);

            Route::get('/settings', [BrandSettingsController::class, 'index']);
            Route::put('/settings', [BrandSettingsController::class, 'update']);

            Route::get('/notifications', [BrandNotificationController::class, 'index']);
            Route::post('/notifications/{notificationId}/read', [BrandNotificationController::class, 'markRead']);
            Route::post('/notifications/read-all', [BrandNotificationController::class, 'markAllRead']);

            Route::get('/audit-logs', [BrandAuditLogController::class, 'index']);

            Route::get('/finance', [BrandPlaceholderController::class, 'finance']);
            Route::get('/marketplace', [BrandPlaceholderController::class, 'marketplace']);
            Route::get('/sponsorship', [BrandPlaceholderController::class, 'sponsorship']);
            Route::get('/events', [BrandPlaceholderController::class, 'events']);
        });

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

        Route::post('/articles', [CmsController::class, 'storeArticle']);
        Route::put('/articles/{id}', [CmsController::class, 'updateArticle']);
        Route::post('/articles/{id}/submit-review', [CmsController::class, 'submitArticleReview']);
        Route::post('/articles/{id}/publish', [CmsController::class, 'publishArticle']);
        Route::post('/articles/{id}/unpublish', [CmsController::class, 'unpublishArticle']);
        Route::post('/articles/{id}/archive', [CmsController::class, 'archiveArticle']);

        Route::get('/me/roles', [MeRoleController::class, 'roles']);
        Route::post('/me/role-requests', [MeRoleController::class, 'requestRole']);
        Route::get('/me/role-requests', [MeRoleController::class, 'roleRequests']);
        Route::post('/me/active-role', [ActiveRoleController::class, 'switch']);

        Route::post('/role-requests/{id}/approve', [RoleRequestController::class, 'approve'])->middleware('admin');
        Route::post('/role-requests/{id}/reject', [RoleRequestController::class, 'reject'])->middleware('admin');
        Route::post('/role-requests/{id}/need-revision', [RoleRequestController::class, 'needRevision'])->middleware('admin');

        Route::post('/invitations', [InvitationController::class, 'store']);
        Route::get('/me/invitations', [InvitationController::class, 'myInvitations']);
        Route::post('/invitations/{token}/accept', [InvitationController::class, 'accept']);
        Route::post('/invitations/{token}/reject', [InvitationController::class, 'reject']);

        Route::get('/me/identities', [ActiveRoleController::class, 'identities']);

        Route::post('/upload', [UploadController::class, 'store']);
        Route::delete('/upload', [UploadController::class, 'destroy']);

        Route::get('/member/dashboard', MemberDashboardController::class);

        Route::get('/member/notifications', [NotificationController::class, 'index']);
        Route::get('/member/notifications/{id}', [NotificationController::class, 'show']);
        Route::post('/member/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/member/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        Route::get('/me/notifications', [MeNotificationController::class, 'index']);
        Route::post('/me/notifications/{id}/read', [MeNotificationController::class, 'markAsRead']);

        Route::post('/reports', [ReportController::class, 'store']);
        Route::get('/member/reports', [ReportController::class, 'index']);
        Route::get('/member/reports/{id}', [ReportController::class, 'show']);

        Route::post('/member/favorites', [FavoriteController::class, 'store']);
        Route::get('/member/favorites', [FavoriteController::class, 'index']);
        Route::delete('/member/favorites/{id}', [FavoriteController::class, 'destroy']);

        Route::get('/volunteer/opportunities', [VolunteerController::class, 'index']);
        Route::get('/volunteer/opportunities/{id}', [VolunteerController::class, 'show']);
        Route::post('/volunteer/opportunities/{id}/apply', [VolunteerController::class, 'apply']);
        Route::get('/me/volunteer-applications', [VolunteerController::class, 'myApplications']);

        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::post('/me/products', [ProductController::class, 'store']);
        Route::get('/me/products', [ProductController::class, 'myProducts']);
        Route::post('/products/{id}/wishlist', [ProductController::class, 'toggleWishlist']);
        Route::get('/me/wishlist', [ProductController::class, 'myWishlist']);

        Route::get('/me/wallet', [WalletController::class, 'balance']);
        Route::get('/me/wallet/transactions', [WalletController::class, 'transactions']);
        Route::post('/me/wallet/topup', [WalletController::class, 'topUp']);

        Route::get('/me/chat/threads', [ChatController::class, 'threads']);
        Route::get('/me/chat/threads/{threadId}/messages', [ChatController::class, 'messages']);
        Route::post('/me/chat/threads/{threadId}/messages', [ChatController::class, 'send']);

        Route::prefix('admin')->middleware(['admin'])->group(function () {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::get('/role-requests', [AdminController::class, 'roleRequests']);
            Route::post('/role-requests/{id}/approve', [RoleRequestController::class, 'approve']);
            Route::post('/role-requests/{id}/reject', [RoleRequestController::class, 'reject']);
            Route::post('/role-requests/{id}/need-revision', [RoleRequestController::class, 'needRevision']);
            Route::get('/communities', [AdminController::class, 'communities']);
            Route::post('/communities/{id}/approve', [CommunityController::class, 'approve']);
            Route::post('/communities/{id}/reject', [CommunityController::class, 'reject']);
            Route::post('/communities/{id}/need-revision', [CommunityController::class, 'needRevision']);
            Route::get('/organizations', [AdminController::class, 'organizations']);
            Route::post('/organizations/{id}/approve', [OrganizationController::class, 'approve']);
            Route::post('/organizations/{id}/reject', [OrganizationController::class, 'reject']);
            Route::post('/organizations/{id}/need-revision', [OrganizationController::class, 'needRevision']);
            Route::get('/brands', [AdminController::class, 'brands']);
            Route::post('/brands/{id}/approve', [BrandController::class, 'approve']);
            Route::post('/brands/{id}/reject', [BrandController::class, 'reject']);
            Route::post('/brands/{id}/need-revision', [BrandController::class, 'needRevision']);
            Route::get('/articles', [AdminController::class, 'articles']);
            Route::get('/events', [AdminController::class, 'events']);
            Route::get('/collaborations', [AdminController::class, 'collaborations']);
            Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
            Route::get('/reports', [AdminController::class, 'reports']);
        });
    });
});
