export interface Lead {
  id: string;
  organization_id: string;
  assigned_to: string | null;
  name: string;
  email: string;
  phone?: string;
  company: string;
  source?: string;
  status: string; // e.g., 'new', 'contacted', etc.
  lead_score?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company: string;
  source?: string;
  status?: string;
  lead_score?: number;
  notes?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {}

export interface LeadResponse {
  success: boolean;
  message: string;
  data: Lead;
}

export interface LeadsListResponse {
  success: boolean;
  message: string;
  data: Lead[];
}
