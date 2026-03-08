export interface Project {
  id: string;
  organization_id: string;
  client_id: string; 
  name: string;
  project_type?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  budget?: string | number;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateProjectPayload {
  client_id: string;
  name: string;
  project_type?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'planning' | 'active' | 'on_hold' | 'completed';
  budget?: number;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectsListResponse {
  success: boolean;
  message: string;
  data: Project[];
}