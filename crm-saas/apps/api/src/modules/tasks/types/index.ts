export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  organization_id: string;
  project_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: Date | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateTaskDTO {
  project_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  deadline?: string; 
}

export type UpdateTaskDTO = Partial<Omit<CreateTaskDTO, 'project_id'>>;

// --- Task Comment Types ---
export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment_text: string;
  created_at: Date;
}

export interface CreateTaskCommentDTO {
  comment_text: string;
}

export interface UpdateTaskCommentDTO {
  comment_text: string;
}