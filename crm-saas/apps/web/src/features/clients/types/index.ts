export interface Client {
  id: string;
  organization_id: string;
  company_name: string;
  primary_contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  timezone?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateClientPayload {
  company_name: string;
  primary_contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  timezone?: string;
  notes?: string;
}

export interface UpdateClientPayload extends Partial<CreateClientPayload> {}

export interface ClientResponse {
  success: boolean;
  message: string;
  data: Client;
}

export interface ClientsListResponse {
  success: boolean;
  message: string;
  data: Client[];
}