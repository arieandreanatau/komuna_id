<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            // Public/Base
            ['name' => 'Member', 'slug' => 'member', 'scope' => 'platform'],
            // Community
            ['name' => 'Owner Komunitas', 'slug' => 'community-owner', 'scope' => 'community'],
            ['name' => 'Community Admin', 'slug' => 'community-admin', 'scope' => 'community'],
            ['name' => 'Event Manager', 'slug' => 'event-manager', 'scope' => 'community'],
            ['name' => 'Volunteer Coordinator', 'slug' => 'volunteer-coordinator', 'scope' => 'community'],
            // Organization
            ['name' => 'Owner Organization', 'slug' => 'org-owner', 'scope' => 'organization'],
            ['name' => 'Organization Admin', 'slug' => 'org-admin', 'scope' => 'organization'],
            ['name' => 'Organization Finance', 'slug' => 'org-finance', 'scope' => 'organization'],
            ['name' => 'Organization Partnership', 'slug' => 'org-partnership', 'scope' => 'organization'],
            // Brand
            ['name' => 'Brand Owner', 'slug' => 'brand-owner', 'scope' => 'brand'],
            ['name' => 'Brand Manager', 'slug' => 'brand-manager', 'scope' => 'brand'],
            ['name' => 'Brand Staff', 'slug' => 'brand-staff', 'scope' => 'brand'],
            // Commerce/Venue
            ['name' => 'Marketplace Seller', 'slug' => 'marketplace-seller', 'scope' => 'platform'],
            ['name' => 'Venue Owner', 'slug' => 'venue-owner', 'scope' => 'platform'],
            // Content
            ['name' => 'Content Contributor', 'slug' => 'content-contributor', 'scope' => 'platform'],
            ['name' => 'Content Editor', 'slug' => 'content-editor', 'scope' => 'platform'],
            // Internal Platform
            ['name' => 'Super Admin', 'slug' => 'super-admin', 'scope' => 'platform'],
            ['name' => 'Platform Admin', 'slug' => 'platform-admin', 'scope' => 'platform'],
            ['name' => 'Moderator', 'slug' => 'moderator', 'scope' => 'platform'],
            ['name' => 'Platform Finance Admin', 'slug' => 'platform-finance-admin', 'scope' => 'platform'],
            ['name' => 'Platform Partnership Admin', 'slug' => 'platform-partnership-admin', 'scope' => 'platform'],
            ['name' => 'Support Admin', 'slug' => 'support-admin', 'scope' => 'platform'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }

        $permissions = [
            // User management
            ['name' => 'View Users', 'slug' => 'users.view', 'group' => 'user'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'group' => 'user'],
            ['name' => 'Update Users', 'slug' => 'users.update', 'group' => 'user'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'group' => 'user'],
            ['name' => 'Suspend Users', 'slug' => 'users.suspend', 'group' => 'user'],
            // Role management
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
            // Organization
            ['name' => 'View Organizations', 'slug' => 'organizations.view', 'group' => 'organization'],
            ['name' => 'Create Organizations', 'slug' => 'organizations.create', 'group' => 'organization'],
            ['name' => 'Manage Organizations', 'slug' => 'organizations.manage', 'group' => 'organization'],
            ['name' => 'Approve Organizations', 'slug' => 'organizations.approve', 'group' => 'organization'],
            // Brand
            ['name' => 'View Brands', 'slug' => 'brands.view', 'group' => 'brand'],
            ['name' => 'Create Brands', 'slug' => 'brands.create', 'group' => 'brand'],
            ['name' => 'Manage Brands', 'slug' => 'brands.manage', 'group' => 'brand'],
            ['name' => 'Approve Brands', 'slug' => 'brands.approve', 'group' => 'brand'],
            // Collaboration
            ['name' => 'View Collaborations', 'slug' => 'collaborations.view', 'group' => 'collaboration'],
            ['name' => 'Create Collaborations', 'slug' => 'collaborations.create', 'group' => 'collaboration'],
            ['name' => 'Manage Collaborations', 'slug' => 'collaborations.manage', 'group' => 'collaboration'],
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
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
