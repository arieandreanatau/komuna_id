<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Member', 'slug' => 'member', 'scope' => 'platform'],
            ['name' => 'Owner Komunitas', 'slug' => 'community-owner', 'scope' => 'community'],
            ['name' => 'Community Admin', 'slug' => 'community-admin', 'scope' => 'community'],
            ['name' => 'Event Manager', 'slug' => 'event-manager', 'scope' => 'community'],
            ['name' => 'Volunteer Coordinator', 'slug' => 'volunteer-coordinator', 'scope' => 'community'],
            ['name' => 'Owner Organization', 'slug' => 'org-owner', 'scope' => 'organization'],
            ['name' => 'Organization Admin', 'slug' => 'org-admin', 'scope' => 'organization'],
            ['name' => 'Organization Finance', 'slug' => 'org-finance', 'scope' => 'organization'],
            ['name' => 'Organization Partnership', 'slug' => 'org-partnership', 'scope' => 'organization'],
            ['name' => 'Brand Owner', 'slug' => 'brand-owner', 'scope' => 'brand'],
            ['name' => 'Brand Manager', 'slug' => 'brand-manager', 'scope' => 'brand'],
            ['name' => 'Brand Staff', 'slug' => 'brand-staff', 'scope' => 'brand'],
            ['name' => 'Marketplace Seller', 'slug' => 'marketplace-seller', 'scope' => 'platform'],
            ['name' => 'Venue Owner', 'slug' => 'venue-owner', 'scope' => 'platform'],
            ['name' => 'Content Contributor', 'slug' => 'content-contributor', 'scope' => 'platform'],
            ['name' => 'Content Editor', 'slug' => 'content-editor', 'scope' => 'platform'],
            ['name' => 'Super Admin', 'slug' => 'super-admin', 'scope' => 'platform'],
            ['name' => 'Platform Admin', 'slug' => 'platform-admin', 'scope' => 'platform'],
            ['name' => 'Moderator', 'slug' => 'moderator', 'scope' => 'platform'],
            ['name' => 'Platform Finance Admin', 'slug' => 'platform-finance-admin', 'scope' => 'platform'],
            ['name' => 'Platform Partnership Admin', 'slug' => 'platform-partnership-admin', 'scope' => 'platform'],
            ['name' => 'Support Admin', 'slug' => 'support-admin', 'scope' => 'platform'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }

        $permissions = [
            // User
            ['name' => 'View Users', 'slug' => 'users.view', 'group' => 'user'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'group' => 'user'],
            ['name' => 'Update Users', 'slug' => 'users.update', 'group' => 'user'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'group' => 'user'],
            ['name' => 'Suspend Users', 'slug' => 'users.suspend', 'group' => 'user'],
            // Role
            ['name' => 'View Roles', 'slug' => 'roles.view', 'group' => 'role'],
            ['name' => 'Manage Roles', 'slug' => 'roles.manage', 'group' => 'role'],
            ['name' => 'Approve Role Requests', 'slug' => 'roles.approve', 'group' => 'role'],
            // Community
            ['name' => 'View Communities', 'slug' => 'communities.view', 'group' => 'community'],
            ['name' => 'Create Communities', 'slug' => 'communities.create', 'group' => 'community'],
            ['name' => 'Manage Communities', 'slug' => 'communities.manage', 'group' => 'community'],
            ['name' => 'Approve Communities', 'slug' => 'communities.approve', 'group' => 'community'],
            ['name' => 'Manage Community Members', 'slug' => 'communities.members.manage', 'group' => 'community'],
            // Event
            ['name' => 'View Events', 'slug' => 'events.view', 'group' => 'event'],
            ['name' => 'Create Events', 'slug' => 'events.create', 'group' => 'event'],
            ['name' => 'Manage Events', 'slug' => 'events.manage', 'group' => 'event'],
            ['name' => 'Manage Event Registration', 'slug' => 'events.registration.manage', 'group' => 'event'],
            ['name' => 'Check-in Event Participants', 'slug' => 'events.checkin', 'group' => 'event'],
            // Organization - Core
            ['name' => 'View Organization', 'slug' => 'organization.view', 'group' => 'organization'],
            ['name' => 'Create Organization', 'slug' => 'organization.create', 'group' => 'organization'],
            ['name' => 'Update Organization', 'slug' => 'organization.update', 'group' => 'organization'],
            ['name' => 'Submit Organization Review', 'slug' => 'organization.submit_review', 'group' => 'organization'],
            ['name' => 'Archive Organization', 'slug' => 'organization.archive', 'group' => 'organization'],
            ['name' => 'Request Organization Delete', 'slug' => 'organization.request_delete', 'group' => 'organization'],
            ['name' => 'Approve Organizations', 'slug' => 'organizations.approve', 'group' => 'organization'],
            // Organization - Legal & Documents
            ['name' => 'View Organization Legal', 'slug' => 'organization.legal.view', 'group' => 'organization'],
            ['name' => 'Update Organization Legal', 'slug' => 'organization.legal.update_request', 'group' => 'organization'],
            ['name' => 'View Organization Documents', 'slug' => 'organization.document.view', 'group' => 'organization'],
            ['name' => 'Upload Organization Documents', 'slug' => 'organization.document.upload', 'group' => 'organization'],
            // Organization - Settings & Audit
            ['name' => 'View Organization Settings', 'slug' => 'organization.settings.view', 'group' => 'organization'],
            ['name' => 'Update Organization Settings', 'slug' => 'organization.settings.update', 'group' => 'organization'],
            ['name' => 'View Organization Audit Logs', 'slug' => 'organization.audit.view', 'group' => 'organization'],
            // Organization - Team
            ['name' => 'View Organization Team', 'slug' => 'organization.team.view', 'group' => 'organization'],
            ['name' => 'Invite Organization Team', 'slug' => 'organization.team.invite', 'group' => 'organization'],
            ['name' => 'Update Organization Team', 'slug' => 'organization.team.update', 'group' => 'organization'],
            ['name' => 'Remove Organization Team', 'slug' => 'organization.team.remove', 'group' => 'organization'],
            ['name' => 'Assign Organization Role', 'slug' => 'organization.role.assign', 'group' => 'organization'],
            ['name' => 'Update Organization Role', 'slug' => 'organization.role.update', 'group' => 'organization'],
            ['name' => 'Revoke Organization Role', 'slug' => 'organization.role.revoke', 'group' => 'organization'],
            ['name' => 'View Organization Role History', 'slug' => 'organization.role.history', 'group' => 'organization'],
            // Organization - Brands
            ['name' => 'View Organization Brands', 'slug' => 'organization.brand.view', 'group' => 'organization'],
            ['name' => 'Create Organization Brand', 'slug' => 'organization.brand.create', 'group' => 'organization'],
            ['name' => 'Update Organization Brand', 'slug' => 'organization.brand.update', 'group' => 'organization'],
            ['name' => 'Archive Organization Brand', 'slug' => 'organization.brand.archive', 'group' => 'organization'],
            // Organization - Products
            ['name' => 'View Organization Products', 'slug' => 'organization.product.view', 'group' => 'organization'],
            ['name' => 'Create Organization Products', 'slug' => 'organization.product.create', 'group' => 'organization'],
            ['name' => 'Update Organization Products', 'slug' => 'organization.product.update', 'group' => 'organization'],
            ['name' => 'Archive Organization Products', 'slug' => 'organization.product.archive', 'group' => 'organization'],
            // Organization - Campaign
            ['name' => 'View Organization Campaigns', 'slug' => 'organization.campaign.view', 'group' => 'organization'],
            ['name' => 'Create Organization Campaigns', 'slug' => 'organization.campaign.create', 'group' => 'organization'],
            ['name' => 'Update Organization Campaigns', 'slug' => 'organization.campaign.update', 'group' => 'organization'],
            ['name' => 'Submit Organization Campaigns', 'slug' => 'organization.campaign.submit', 'group' => 'organization'],
            ['name' => 'View Organization Campaign Reports', 'slug' => 'organization.campaign.report', 'group' => 'organization'],
            // Organization - Collaboration
            ['name' => 'View Organization Collaborations', 'slug' => 'organization.collaboration.view', 'group' => 'organization'],
            ['name' => 'Create Organization Collaborations', 'slug' => 'organization.collaboration.create', 'group' => 'organization'],
            ['name' => 'Update Organization Collaborations', 'slug' => 'organization.collaboration.update', 'group' => 'organization'],
            ['name' => 'Approve Organization Collaborations', 'slug' => 'organization.collaboration.approve', 'group' => 'organization'],
            ['name' => 'Reject Organization Collaborations', 'slug' => 'organization.collaboration.reject', 'group' => 'organization'],
            ['name' => 'Archive Organization Collaborations', 'slug' => 'organization.collaboration.archive', 'group' => 'organization'],
            // Organization - Finance & Report
            ['name' => 'View Organization Finance', 'slug' => 'organization.finance.view', 'group' => 'organization'],
            ['name' => 'Export Organization Finance', 'slug' => 'organization.finance.export', 'group' => 'organization'],
            ['name' => 'View Organization Reports', 'slug' => 'organization.report.view', 'group' => 'organization'],
            ['name' => 'Export Organization Reports', 'slug' => 'organization.report.export', 'group' => 'organization'],
            // Brand - Core
            ['name' => 'View Brand', 'slug' => 'brand.view', 'group' => 'brand'],
            ['name' => 'Create Brand', 'slug' => 'brand.create', 'group' => 'brand'],
            ['name' => 'Update Brand', 'slug' => 'brand.update', 'group' => 'brand'],
            ['name' => 'Submit Brand Review', 'slug' => 'brand.submit_review', 'group' => 'brand'],
            ['name' => 'Archive Brand', 'slug' => 'brand.archive', 'group' => 'brand'],
            ['name' => 'Request Brand Delete', 'slug' => 'brand.request_delete', 'group' => 'brand'],
            ['name' => 'Approve Brands', 'slug' => 'brands.approve', 'group' => 'brand'],
            // Brand - Documents & Settings
            ['name' => 'View Brand Documents', 'slug' => 'brand.document.view', 'group' => 'brand'],
            ['name' => 'Upload Brand Documents', 'slug' => 'brand.document.upload', 'group' => 'brand'],
            ['name' => 'View Brand Settings', 'slug' => 'brand.settings.view', 'group' => 'brand'],
            ['name' => 'Update Brand Settings', 'slug' => 'brand.settings.update', 'group' => 'brand'],
            ['name' => 'View Brand Audit Logs', 'slug' => 'brand.audit.view', 'group' => 'brand'],
            // Brand - Team
            ['name' => 'View Brand Team', 'slug' => 'brand.team.view', 'group' => 'brand'],
            ['name' => 'Invite Brand Team', 'slug' => 'brand.team.invite', 'group' => 'brand'],
            ['name' => 'Update Brand Team', 'slug' => 'brand.team.update', 'group' => 'brand'],
            ['name' => 'Remove Brand Team', 'slug' => 'brand.team.remove', 'group' => 'brand'],
            ['name' => 'Assign Brand Role', 'slug' => 'brand.role.assign', 'group' => 'brand'],
            ['name' => 'Update Brand Role', 'slug' => 'brand.role.update', 'group' => 'brand'],
            ['name' => 'Revoke Brand Role', 'slug' => 'brand.role.revoke', 'group' => 'brand'],
            ['name' => 'View Brand Role History', 'slug' => 'brand.role.history', 'group' => 'brand'],
            // Brand - Products
            ['name' => 'View Brand Products', 'slug' => 'brand.product.view', 'group' => 'brand'],
            ['name' => 'Create Brand Products', 'slug' => 'brand.product.create', 'group' => 'brand'],
            ['name' => 'Update Brand Products', 'slug' => 'brand.product.update', 'group' => 'brand'],
            ['name' => 'Archive Brand Products', 'slug' => 'brand.product.archive', 'group' => 'brand'],
            // Brand - Campaign
            ['name' => 'View Brand Campaigns', 'slug' => 'brand.campaign.view', 'group' => 'brand'],
            ['name' => 'Create Brand Campaigns', 'slug' => 'brand.campaign.create', 'group' => 'brand'],
            ['name' => 'Update Brand Campaigns', 'slug' => 'brand.campaign.update', 'group' => 'brand'],
            ['name' => 'Submit Brand Campaigns', 'slug' => 'brand.campaign.submit', 'group' => 'brand'],
            ['name' => 'Approve Brand Campaigns', 'slug' => 'brand.campaign.approve', 'group' => 'brand'],
            ['name' => 'View Brand Campaign Reports', 'slug' => 'brand.campaign.report', 'group' => 'brand'],
            // Brand - Collaboration
            ['name' => 'View Brand Collaborations', 'slug' => 'brand.collaboration.view', 'group' => 'brand'],
            ['name' => 'Create Brand Collaborations', 'slug' => 'brand.collaboration.create', 'group' => 'brand'],
            ['name' => 'Update Brand Collaborations', 'slug' => 'brand.collaboration.update', 'group' => 'brand'],
            ['name' => 'Submit Brand Collaborations', 'slug' => 'brand.collaboration.submit', 'group' => 'brand'],
            ['name' => 'Approve Brand Collaborations', 'slug' => 'brand.collaboration.approve', 'group' => 'brand'],
            ['name' => 'Reject Brand Collaborations', 'slug' => 'brand.collaboration.reject', 'group' => 'brand'],
            ['name' => 'Archive Brand Collaborations', 'slug' => 'brand.collaboration.archive', 'group' => 'brand'],
            // Brand - Finance & Report
            ['name' => 'View Brand Finance', 'slug' => 'brand.finance.view', 'group' => 'brand'],
            ['name' => 'Export Brand Finance', 'slug' => 'brand.finance.export', 'group' => 'brand'],
            ['name' => 'View Brand Reports', 'slug' => 'brand.report.view', 'group' => 'brand'],
            ['name' => 'Export Brand Reports', 'slug' => 'brand.report.export', 'group' => 'brand'],
            // Invitation
            ['name' => 'View Invitations', 'slug' => 'invitation.view', 'group' => 'invitation'],
            ['name' => 'Accept Invitations', 'slug' => 'invitation.accept', 'group' => 'invitation'],
            ['name' => 'Reject Invitations', 'slug' => 'invitation.reject', 'group' => 'invitation'],
            // CMS
            ['name' => 'View Articles', 'slug' => 'articles.view', 'group' => 'cms'],
            ['name' => 'Create Articles', 'slug' => 'articles.create', 'group' => 'cms'],
            ['name' => 'Edit Articles', 'slug' => 'articles.edit', 'group' => 'cms'],
            ['name' => 'Publish Articles', 'slug' => 'articles.publish', 'group' => 'cms'],
            ['name' => 'Manage Pages', 'slug' => 'pages.manage', 'group' => 'cms'],
            ['name' => 'Manage FAQs', 'slug' => 'faqs.manage', 'group' => 'cms'],
            // Admin
            ['name' => 'View Admin Dashboard', 'slug' => 'admin.dashboard', 'group' => 'admin'],
            ['name' => 'View Audit Logs', 'slug' => 'admin.audit-logs', 'group' => 'admin'],
            ['name' => 'Manage Master Data', 'slug' => 'admin.master-data', 'group' => 'admin'],
            ['name' => 'View Reports', 'slug' => 'admin.reports', 'group' => 'admin'],
            ['name' => 'Manage Support Tickets', 'slug' => 'admin.support', 'group' => 'admin'],
            ['name' => 'Manage Moderation', 'slug' => 'admin.moderation', 'group' => 'admin'],
            // Community additional
            ['name' => 'Manage Community Roles', 'slug' => 'community.roles.manage', 'group' => 'community'],
            ['name' => 'View Community Audit Logs', 'slug' => 'community.audit.view', 'group' => 'community'],
            ['name' => 'View Community Settings', 'slug' => 'community.settings.view', 'group' => 'community'],
            ['name' => 'Manage Community Settings', 'slug' => 'community.settings.manage', 'group' => 'community'],
            ['name' => 'Create Community Announcements', 'slug' => 'community.announcements.create', 'group' => 'community'],
            ['name' => 'View Community Reports', 'slug' => 'community.reports.view', 'group' => 'community'],
            ['name' => 'Export Community Data', 'slug' => 'community.export', 'group' => 'community'],
            ['name' => 'Manage Volunteers', 'slug' => 'community.volunteers.manage', 'group' => 'community'],
            ['name' => 'Manage Collaborations in Community', 'slug' => 'community.collaborations.manage', 'group' => 'community'],
            ['name' => 'Manage Community Finance', 'slug' => 'community.finance.manage', 'group' => 'community'],
            ['name' => 'Manage Community Marketplace', 'slug' => 'community.marketplace.manage', 'group' => 'community'],
            ['name' => 'Manage Community Media', 'slug' => 'community.media.manage', 'group' => 'community'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }

        $this->assignPermissionsToRoles();
    }

    private function assignPermissionsToRoles(): void
    {
        // Community roles
        $okRole = Role::where('slug', 'community-owner')->first();
        $caRole = Role::where('slug', 'community-admin')->first();
        $emRole = Role::where('slug', 'event-manager')->first();
        $vcRole = Role::where('slug', 'volunteer-coordinator')->first();

        if ($okRole) {
            $okRole->permissions()->sync(Permission::where('group', 'community')->pluck('id')->toArray());
        }

        if ($caRole) {
            $caRole->permissions()->sync(Permission::whereIn('slug', [
                'communities.view', 'communities.manage', 'communities.members.manage',
                'events.view', 'events.create', 'events.manage', 'events.registration.manage', 'events.checkin',
                'community.announcements.create', 'community.reports.view',
            ])->pluck('id')->toArray());
        }

        if ($emRole) {
            $emRole->permissions()->sync(Permission::whereIn('slug', [
                'communities.view', 'events.view', 'events.create', 'events.manage',
                'events.registration.manage', 'events.checkin',
            ])->pluck('id')->toArray());
        }

        if ($vcRole) {
            $vcRole->permissions()->sync(Permission::whereIn('slug', [
                'communities.view', 'community.volunteers.manage',
            ])->pluck('id')->toArray());
        }

        $this->assignOrganizationPermissions();
        $this->assignBrandPermissions();
    }

    private function assignOrganizationPermissions(): void
    {
        $orgOwnerPerms = Permission::where('group', 'organization')->pluck('id')->toArray();
        $orgOwnerRole = Role::where('slug', 'org-owner')->first();
        if ($orgOwnerRole) {
            $orgOwnerRole->permissions()->sync($orgOwnerPerms);
        }

        $orgAdminPerms = Permission::whereIn('slug', [
            'organization.view', 'organization.update', 'organization.submit_review',
            'organization.document.view', 'organization.document.upload',
            'organization.team.view', 'organization.brand.view', 'organization.brand.create', 'organization.brand.update',
            'organization.product.view', 'organization.product.create', 'organization.product.update',
            'organization.campaign.view', 'organization.campaign.create', 'organization.campaign.update',
            'organization.collaboration.view', 'organization.collaboration.create', 'organization.collaboration.update',
            'organization.report.view',
        ])->pluck('id')->toArray();
        $orgAdminRole = Role::where('slug', 'org-admin')->first();
        if ($orgAdminRole) {
            $orgAdminRole->permissions()->sync($orgAdminPerms);
        }

        $orgFinancePerms = Permission::whereIn('slug', [
            'organization.view', 'organization.finance.view', 'organization.finance.export',
            'organization.report.view', 'organization.report.export',
            'organization.document.view',
        ])->pluck('id')->toArray();
        $orgFinanceRole = Role::where('slug', 'org-finance')->first();
        if ($orgFinanceRole) {
            $orgFinanceRole->permissions()->sync($orgFinancePerms);
        }

        $orgPartnershipPerms = Permission::whereIn('slug', [
            'organization.view', 'organization.collaboration.view', 'organization.collaboration.create',
            'organization.collaboration.update', 'organization.campaign.view', 'organization.campaign.create',
            'organization.report.view',
        ])->pluck('id')->toArray();
        $orgPartnershipRole = Role::where('slug', 'org-partnership')->first();
        if ($orgPartnershipRole) {
            $orgPartnershipRole->permissions()->sync($orgPartnershipPerms);
        }
    }

    private function assignBrandPermissions(): void
    {
        $brandOwnerPerms = Permission::where('group', 'brand')->pluck('id')->toArray();
        $brandOwnerRole = Role::where('slug', 'brand-owner')->first();
        if ($brandOwnerRole) {
            $brandOwnerRole->permissions()->sync($brandOwnerPerms);
        }

        $brandManagerPerms = Permission::whereIn('slug', [
            'brand.view', 'brand.update',
            'brand.document.view', 'brand.document.upload',
            'brand.team.view',
            'brand.product.view', 'brand.product.create', 'brand.product.update',
            'brand.campaign.view', 'brand.campaign.create', 'brand.campaign.update', 'brand.campaign.submit', 'brand.campaign.approve',
            'brand.collaboration.view', 'brand.collaboration.create', 'brand.collaboration.update',
            'brand.report.view',
        ])->pluck('id')->toArray();
        $brandManagerRole = Role::where('slug', 'brand-manager')->first();
        if ($brandManagerRole) {
            $brandManagerRole->permissions()->sync($brandManagerPerms);
        }

        $brandStaffPerms = Permission::whereIn('slug', [
            'brand.view',
            'brand.document.view', 'brand.document.upload',
            'brand.product.view',
            'brand.campaign.view', 'brand.campaign.create',
            'brand.collaboration.view',
        ])->pluck('id')->toArray();
        $brandStaffRole = Role::where('slug', 'brand-staff')->first();
        if ($brandStaffRole) {
            $brandStaffRole->permissions()->sync($brandStaffPerms);
        }
    }
}
