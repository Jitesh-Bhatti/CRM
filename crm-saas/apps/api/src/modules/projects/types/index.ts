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

export interface UpdateProjectMemberDTO {
  role_in_project: string;
}

// --- Milestone Types ---
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  status: MilestoneStatus;
  approval_status: ApprovalStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMilestoneDTO {
  title: string;
  description?: string;
  deadline?: string; 
  status?: MilestoneStatus;
  approval_status?: ApprovalStatus;
}

export type UpdateMilestoneDTO = Partial<CreateMilestoneDTO>;

// --- Project Requirement Types ---
export interface ProjectRequirement {
  id: string;
  project_id: string;
  requirement_text: string;
  created_by: string;
  created_at: Date;
}

export interface CreateProjectRequirementDTO {
  requirement_text: string;
}

export type UpdateProjectRequirementDTO = Partial<CreateProjectRequirementDTO>;

// --- Change Request Types ---
export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ChangeRequest {
  id: string;
  project_id: string;
  requested_by: string;
  description: string;
  status: ChangeRequestStatus;
  approved_by: string | null;
  created_at: Date;
}

export interface CreateChangeRequestDTO {
  description: string;
}

export interface UpdateChangeRequestDTO {
  description?: string;
  status?: ChangeRequestStatus;
  // Note: approved_by is omitted here because we handle it automatically in the Service layer
}