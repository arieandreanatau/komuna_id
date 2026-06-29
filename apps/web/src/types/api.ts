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
  name: string;
  email: string;
  status: "pending" | "active" | "suspended" | "banned";
  email_verified_at: string | null;
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
