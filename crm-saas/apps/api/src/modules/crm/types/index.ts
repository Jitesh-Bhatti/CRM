// --- Client Types ---
export interface Client {
  id: string;
  organization_id: string;
  company_name: string;
  primary_contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  country: string | null;
  timezone: string | null;
  notes: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateClientDTO {
  company_name: string;
  primary_contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  timezone?: string;
  notes?: string;
}

export type UpdateClientDTO = Partial<CreateClientDTO>;

// --- Lead Types ---
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

export interface Lead {
  id: string;
  organization_id: string;
  assigned_to: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  status: LeadStatus;
  lead_score: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateLeadDTO {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: LeadStatus;
  assigned_to?: string;
  lead_score?: number;
  notes?: string;
}

export type UpdateLeadDTO = Partial<CreateLeadDTO>;

// --- Client Contact Types (UPDATED WITH DELETED_AT) ---
export interface ClientContact {
  id: string;
  client_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  is_primary: boolean;
  created_at: Date;
  deleted_at: Date | null; // <-- Added back
}

export interface CreateClientContactDTO {
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  is_primary?: boolean;
}

export type UpdateClientContactDTO = Partial<CreateClientContactDTO>;