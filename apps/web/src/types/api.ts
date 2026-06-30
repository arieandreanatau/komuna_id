export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
  meta: PaginationMeta | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface User {
  id: number;
  uuid: string;
  username: string;
  full_name: string | null;
  name: string;
  email: string | null;
  phone_number: string | null;
  status: "pending" | "active" | "suspended" | "banned";
  verification_level: number;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  identity_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  user_id: number;
  bio: string | null;
  avatar: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  social_links: Record<string, string> | null;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  scope: "platform" | "community" | "organization" | "brand";
}

export interface UserRole {
  id: number;
  name: string;
  slug: string;
  scope: string;
  scope_type: string | null;
  scope_id: number | null;
}

export interface AuthUser extends User {
  profile: Profile | null;
  roles: UserRole[];
}

export interface Community {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string | null;
  logo: string | null;
  location: string | null;
  website: string | null;
  is_public: boolean;
  join_mode: "open" | "approval_required" | "invite_only";
  status: string;
  owner_id: number;
  category: { id: number; name: string } | null;
  members_count?: number;
  created_at: string;
}

export interface CommunityMember {
  id: number;
  community_id: number;
  user_id: number;
  role: string;
  status: string;
  community: Community;
  user?: User;
  joined_at: string;
}

export interface CommunityRoleAssignment {
  id: number;
  community_id: number;
  user_id: number;
  role_id: number;
  assigned_by: number;
  is_active: boolean;
  notes: string | null;
  assigned_at: string;
  user: { id: number; name: string; email: string };
  role: { id: number; name: string; slug: string };
  assigner: { id: number; name: string };
}

export interface CommunityRoleHistory {
  id: number;
  community_id: number;
  user_id: number;
  role_id: number;
  changed_by: number;
  action: string;
  notes: string | null;
  user: { id: number; name: string; email: string };
  role: { id: number; name: string; slug: string };
  changer: { id: number; name: string };
  created_at: string;
}

export interface JoinRequest {
  id: number;
  user: { id: number; name: string; email: string } | null;
  status: "pending" | "approved" | "rejected";
  message: string | null;
  created_at: string;
}

export interface CommunityDashboard {
  community: {
    id: number;
    name: string;
    slug: string;
    status: string;
    logo: string | null;
    member_count: number;
  };
  stats: {
    total_members: number;
    new_members_this_month: number;
    pending_join_requests: number;
    total_events: number;
    active_events: number;
    event_participants: number;
    event_checkins: number;
  };
  recent_members: CommunityMember[];
  recent_join_requests: JoinRequest[];
  upcoming_events: Event[];
  recent_events: Event[];
}

export interface CommunitySettings {
  privacy: {
    is_public: boolean;
    join_mode: string;
  };
  settings: Record<string, string>;
}

export interface Event {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  location: string | null;
  location_url: string | null;
  is_online: boolean;
  online_url: string | null;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  current_participants: number;
  ticket_price: number | null;
  currency: string | null;
  status: string;
  community: { id: number; name: string; slug: string } | null;
  organizer: { id: number; name: string } | null;
  tickets: EventTicket[];
  created_at: string;
}

export interface EventTicket {
  id: number;
  event_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  status: "registered" | "checked_in" | "cancelled";
  qr_code: string;
  registered_at: string;
  checked_in_at: string | null;
  event: Event;
  ticket: EventTicket | null;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export interface Report {
  id: number;
  user_id: number;
  reportable_type: string;
  reportable_id: number;
  reason: string;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  favorable_type: string;
  favorable_id: number;
  created_at: string;
}

export interface RoleRequest {
  id: number;
  user_id: number;
  role_id: number;
  status: "draft" | "submitted" | "under_review" | "need_revision" | "approved" | "rejected" | "suspended";
  notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  role: Role;
  created_at: string;
}

export interface Invitation {
  id: number;
  email: string;
  role_id: number;
  invitable_type: string;
  invitable_id: number;
  token: string;
  invited_by: number;
  accepted_at: string | null;
  expires_at: string;
  role: Role;
  created_at: string;
}

export interface MemberDashboardData {
  user: AuthUser;
  communities_count: number;
  events_count: number;
  tickets_count: number;
  notifications_unread: number;
  recent_communities: Community[];
  upcoming_events: Event[];
  pending_role_requests: number;
  recent_notifications: Notification[];
}
