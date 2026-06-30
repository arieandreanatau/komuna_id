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

export interface Article {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  author: { id: number; name: string; avatar: string | null };
  community: { id: number; name: string; slug: string } | null;
  tags: string[];
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  status: "pending" | "active" | "suspended" | "archived";
  owner_id: number;
  members_count?: number;
  communities_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  website: string | null;
  industry: string;
  status: "pending" | "active" | "suspended" | "archived";
  owner_id: number;
  products_count?: number;
  collaborators_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Collaboration {
  id: number;
  uuid: string;
  title: string;
  description: string;
  status: "proposed" | "accepted" | "in_progress" | "completed" | "cancelled";
  brand_id: number;
  community_id: number;
  brand: Brand;
  community: Community;
  proposed_by: number;
  start_date: string | null;
  end_date: string | null;
  terms: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  user?: { id: number; name: string; email: string };
  action: string;
  auditable_type: string;
  auditable_id: number;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
