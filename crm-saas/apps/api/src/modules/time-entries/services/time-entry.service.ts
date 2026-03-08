import { TimeEntryRepository } from '../repositories/time-entry.repository';
import { ProjectService } from '../../projects/services/project.service';
import { TaskService } from '../../tasks/services/task.service';
import { CreateTimeEntryDTO, UpdateTimeEntryDTO, TimeEntry } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class TimeEntryService {
  private repository: TimeEntryRepository;
  private projectService: ProjectService;
  private taskService: TaskService;

  constructor() {
    this.repository = new TimeEntryRepository();
    this.projectService = new ProjectService();
    this.taskService = new TaskService();
  }

  async createTimeEntry(organizationId: string, userId: string, data: CreateTimeEntryDTO): Promise<TimeEntry> {
    // 1. Verify project belongs to org
    await this.projectService.getProjectById(data.project_id, organizationId);

    // 2. Verify task belongs to org (if provided)
    if (data.task_id) {
      const task = await this.taskService.getTaskById(data.task_id, organizationId);
      // Ensure the task actually belongs to the provided project
      if (task.project_id !== data.project_id) {
        throw new ApiError(400, 'Task does not belong to the specified project');
      }
    }

    return await this.repository.create(organizationId, userId, data);
  }

  async getAllTimeEntries(organizationId: string, projectId?: string, userId?: string): Promise<any[]> {
    if (projectId) {
      await this.projectService.getProjectById(projectId, organizationId);
    }
    return await this.repository.findAllByOrg(organizationId, projectId, userId);
  }

  async getTimeEntryById(id: string, organizationId: string): Promise<TimeEntry> {
    const entry = await this.repository.findByIdAndOrg(id, organizationId);
    if (!entry) {
      throw new ApiError(404, 'Time entry not found');
    }
    return entry;
  }

  async updateTimeEntry(id: string, organizationId: string, userId: string, data: UpdateTimeEntryDTO): Promise<TimeEntry> {
    const entry = await this.getTimeEntryById(id, organizationId); 
    
    // Optional Business Logic: Only allow the user who created it (or an admin) to edit it.
    if (entry.user_id !== userId) {
      throw new ApiError(403, 'You can only edit your own time entries');
    }

    if (data.task_id) {
      const task = await this.taskService.getTaskById(data.task_id, organizationId);
      if (task.project_id !== entry.project_id) {
        throw new ApiError(400, 'Task does not belong to the entry\'s project');
      }
    }

    const updatedEntry = await this.repository.update(id, organizationId, data);
    if (!updatedEntry) {
      throw new ApiError(500, 'Failed to update time entry');
    }
    return updatedEntry;
  }

  async deleteTimeEntry(id: string, organizationId: string, userId: string): Promise<void> {
    const entry = await this.getTimeEntryById(id, organizationId);
    
    if (entry.user_id !== userId) {
      throw new ApiError(403, 'You can only delete your own time entries');
    }

    await this.repository.delete(id, organizationId);
  }
}