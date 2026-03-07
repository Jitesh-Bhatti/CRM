// --- Project Types ---
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
  start_date?: string; 
  end_date?: string;   
  status?: ProjectStatus;
  budget?: number;
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>;

// --- Project Member Types ---
export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role_in_project: string | null;
  assigned_at: Date;
}

export interface CreateProjectMemberDTO {
  user_id: string;
  role_in_project?: string;
}

// We only allow updating the role, not swapping the user
export interface UpdateProjectMemberDTO {
  role_in_project: string;
}