export interface User {
  id: string;
  name: string;
  email: string;
  organization_id: string;
  status?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterOrganizationPayload {
  organization_name: string;
  owner_name: string;
  owner_email: string;
  password: string;
}