export interface RegisterOrganizationDTO {
  organization_name: string;
  owner_name: string;
  owner_email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    organization_id: string;
  };
  token: string;
}