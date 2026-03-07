export interface User {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  status: 'active' | 'invited' | 'suspended';
  timezone: string | null;
  is_org_owner: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  timezone?: string;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  timezone?: string;
  status?: 'active' | 'invited' | 'suspended';
}