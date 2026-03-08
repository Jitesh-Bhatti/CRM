export interface TimeEntry {
  id: string;
  organization_id: string;
  project_id: string;
  task_id: string | null;
  user_id: string;
  hours: number;
  description: string | null;
  billable: boolean;
  created_at: Date;
}

export interface CreateTimeEntryDTO {
  project_id: string;
  task_id?: string;
  hours: number;
  description?: string;
  billable?: boolean;
}

export type UpdateTimeEntryDTO = Partial<Omit<CreateTimeEntryDTO, 'project_id'>>;