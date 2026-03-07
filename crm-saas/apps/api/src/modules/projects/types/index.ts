export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  organization_id: string;
  client_id: string;
  name: string;
  project_type: string | null;
  description: string | null;
  start_date: Date | null;
  end_date: Date | null;
  status: ProjectStatus;
  budget: number | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateProjectDTO {
  client_id: string;
  name: string;
  project_type?: string;
  description?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  status?: ProjectStatus;
  budget?: number;
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>;