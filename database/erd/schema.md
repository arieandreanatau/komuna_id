# KomunaID - Database ERD

## Core Tables

### users
- id (bigint, PK)
- uuid (char(36), unique)
- name (varchar(255))
- email (varchar(255), unique)
- email_verified_at (timestamp, nullable)
- password (varchar(255))
- status (enum: pending, active, suspended, banned)
- remember_token (varchar(100), nullable)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### profiles
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- bio (text, nullable)
- avatar (varchar(255), nullable)
- phone (varchar(20), nullable)
- location (varchar(255), nullable)
- website (varchar(255), nullable)
- social_links (json, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### roles
- id (bigint, PK)
- name (varchar(100), unique)
- slug (varchar(100), unique)
- description (text, nullable)
- scope (enum: platform, community, organization, brand)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)

### permissions
- id (bigint, PK)
- name (varchar(100), unique)
- slug (varchar(100), unique)
- description (text, nullable)
- group (varchar(100))
- created_at (timestamp)
- updated_at (timestamp)

### role_permissions
- id (bigint, PK)
- role_id (bigint, FK -> roles.id)
- permission_id (bigint, FK -> permissions.id)
- created_at (timestamp)
- UNIQUE(role_id, permission_id)

### user_roles
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- role_id (bigint, FK -> roles.id)
- scope_type (varchar(100), nullable) -- community, organization, brand
- scope_id (bigint, nullable)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(user_id, role_id, scope_type, scope_id)

### role_requests
- id (bigint, PK)
- user_id (bigint, FK -> users.id)
- role_id (bigint, FK -> roles.id)
- status (enum: pending, approved, rejected, revision)
- notes (text, nullable)
- reviewed_by (bigint, FK -> users.id, nullable)
- reviewed_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

### invitations
- id (bigint, PK)
- email (varchar(255))
- role_id (bigint, FK -> roles.id)
- invitable_type (varchar(100)) -- community, organization, brand
- invitable_id (bigint)
- token (varchar(255), unique)
- status (enum: pending, accepted, expired, cancelled)
- invited_by (bigint, FK -> users.id)
- accepted_by (bigint, FK -> users.id, nullable)
- expires_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

### audit_logs
- id (bigint, PK)
- user_id (bigint, FK -> users.id, nullable)
- action (varchar(100))
- auditable_type (varchar(100))
- auditable_id (bigint)
- old_values (json, nullable)
- new_values (json, nullable)
- ip_address (varchar(45), nullable)
- user_agent (text, nullable)
- created_at (timestamp)

## Community Tables

### community_categories
- id (bigint, PK)
- name (varchar(100))
- slug (varchar(100), unique)
- description (text, nullable)
- icon (varchar(100), nullable)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)

### communities
- id (bigint, PK)
- uuid (char(36), unique)
- name (varchar(255))
- slug (varchar(255), unique)
- description (text)
- cover_image (varchar(255), nullable)
- logo (varchar(255), nullable)
- category_id (bigint, FK -> community_categories.id)
- owner_id (bigint, FK -> users.id)
- status (enum: draft, pending_review, approved, rejected, revision_needed, archived)
- rejection_reason (text, nullable)
- website (varchar(255), nullable)
- location (varchar(255), nullable)
- member_count (integer, default: 0)
- is_public (boolean, default: true)
- join_mode (enum: open, approval_required, invite_only)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### community_members
- id (bigint, PK)
- community_id (bigint, FK -> communities.id)
- user_id (bigint, FK -> users.id)
- role (enum: member, admin, moderator)
- status (enum: pending, active, banned)
- joined_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(community_id, user_id)

### community_join_requests
- id (bigint, PK)
- community_id (bigint, FK -> communities.id)
- user_id (bigint, FK -> users.id)
- status (enum: pending, approved, rejected)
- message (text, nullable)
- reviewed_by (bigint, FK -> users.id, nullable)
- reviewed_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

## Event Tables

### events
- id (bigint, PK)
- uuid (char(36), unique)
- title (varchar(255))
- slug (varchar(255), unique)
- description (text)
- cover_image (varchar(255), nullable)
- community_id (bigint, FK -> communities.id, nullable)
- organizer_id (bigint, FK -> users.id)
- status (enum: draft, published, cancelled, archived)
- start_date (timestamp)
- end_date (timestamp)
- location (varchar(255), nullable)
- location_url (varchar(255), nullable)
- is_online (boolean, default: false)
- online_url (varchar(255), nullable)
- max_participants (integer, nullable)
- current_participants (integer, default: 0)
- ticket_price (decimal, default: 0)
- currency (varchar(3), default: IDR)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### event_tickets
- id (bigint, PK)
- event_id (bigint, FK -> events.id)
- name (varchar(255))
- description (text, nullable)
- price (decimal)
- quantity (integer)
- sold (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)

### event_registrations
- id (bigint, PK)
- event_id (bigint, FK -> events.id)
- user_id (bigint, FK -> users.id)
- ticket_id (bigint, FK -> event_tickets.id, nullable)
- status (enum: registered, checked_in, cancelled)
- qr_code (varchar(255), nullable)
- registered_at (timestamp)
- checked_in_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

## Organization Tables

### organizations
- id (bigint, PK)
- uuid (char(36), unique)
- name (varchar(255))
- slug (varchar(255), unique)
- description (text, nullable)
- logo (varchar(255), nullable)
- website (varchar(255), nullable)
- email (varchar(255))
- phone (varchar(20), nullable)
- address (text, nullable)
- owner_id (bigint, FK -> users.id)
- status (enum: draft, pending_review, approved, rejected, revision_needed, archived)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### organization_members
- id (bigint, PK)
- organization_id (bigint, FK -> organizations.id)
- user_id (bigint, FK -> users.id)
- role (enum: owner, admin, finance, partnership, member)
- status (enum: pending, active, inactive)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(organization_id, user_id)

## Brand Tables

### brands
- id (bigint, PK)
- uuid (char(36), unique)
- name (varchar(255))
- slug (varchar(255), unique)
- description (text, nullable)
- logo (varchar(255), nullable)
- website (varchar(255), nullable)
- email (varchar(255))
- owner_id (bigint, FK -> users.id)
- organization_id (bigint, FK -> organizations.id, nullable)
- status (enum: draft, pending_review, approved, rejected, revision_needed, archived)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### brand_members
- id (bigint, PK)
- brand_id (bigint, FK -> brands.id)
- user_id (bigint, FK -> users.id)
- role (enum: owner, manager, staff)
- status (enum: pending, active, inactive)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(brand_id, user_id)

## Collaboration Tables

### collaborations
- id (bigint, PK)
- uuid (char(36), unique)
- title (varchar(255))
- description (text)
- sender_type (varchar(100)) -- brand, organization
- sender_id (bigint)
- receiver_type (varchar(100)) -- community
- receiver_id (bigint)
- status (enum: inquiry, proposal, negotiation, active, completed, archived, rejected)
- budget (decimal, nullable)
- start_date (date, nullable)
- end_date (date, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### collaboration_deliverables
- id (bigint, PK)
- collaboration_id (bigint, FK -> collaborations.id)
- title (varchar(255))
- description (text, nullable)
- status (enum: pending, in_progress, submitted, approved, rejected)
- due_date (date, nullable)
- completed_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

## CMS Tables

### articles
- id (bigint, PK)
- uuid (char(36), unique)
- title (varchar(255))
- slug (varchar(255), unique)
- content (longtext)
- excerpt (text, nullable)
- cover_image (varchar(255), nullable)
- author_id (bigint, FK -> users.id)
- category_id (bigint, FK -> article_categories.id, nullable)
- status (enum: draft, pending_review, published, unpublished, archived)
- published_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp, nullable)

### article_categories
- id (bigint, PK)
- name (varchar(100))
- slug (varchar(100), unique)
- description (text, nullable)
- is_active (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)

### pages
- id (bigint, PK)
- title (varchar(255))
- slug (varchar(255), unique)
- content (longtext)
- meta_title (varchar(255), nullable)
- meta_description (text, nullable)
- is_published (boolean, default: false)
- created_at (timestamp)
- updated_at (timestamp)

### faqs
- id (bigint, PK)
- question (varchar(255))
- answer (text)
- category (varchar(100), nullable)
- sort_order (integer, default: 0)
- is_published (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
