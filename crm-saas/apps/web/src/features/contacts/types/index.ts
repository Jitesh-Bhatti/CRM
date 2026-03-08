export interface Contact {
  id: string;
  client_id: string;
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  job_title?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateContactPayload {
  name: string;
  email?: string;
  phone?: string;
  designation?: string;
  job_title?: string;
  is_primary?: boolean;
}

export interface UpdateContactPayload extends Partial<CreateContactPayload> {}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface ContactsListResponse {
  success: boolean;
  message: string;
  data: Contact[];
}