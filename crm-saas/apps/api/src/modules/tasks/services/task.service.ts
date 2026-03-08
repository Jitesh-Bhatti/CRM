import { TaskRepository } from '../repositories/task.repository';
import { ProjectService } from '../../projects/services/project.service';
import { UserService } from '../../users/services/user.service';
import { CreateTaskDTO, UpdateTaskDTO, Task } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class TaskService {
  private repository: TaskRepository;
  private projectService: ProjectService;
  private userService: UserService;

  constructor() {
    this.repository = new TaskRepository();
    this.projectService = new ProjectService();
    this.userService = new UserService();
  }

  async createTask(organizationId: string, userId: string, data: CreateTaskDTO): Promise<Task> {
    // 1. Verify project exists in this org
    await this.projectService.getProjectById(data.project_id, organizationId);

    // 2. Verify assigned user exists in this org (if provided)
    if (data.assigned_to) {
      await this.userService.getUserById(data.assigned_to, organizationId);
    }

    return await this.repository.create(organizationId, userId, data);
  }

  async getAllTasks(organizationId: string, projectId?: string): Promise<Task[]> {
    // If filtering by project, ensure the project belongs to the org
    if (projectId) {
      await this.projectService.getProjectById(projectId, organizationId);
    }
    return await this.repository.findAllByOrg(organizationId, projectId);
  }

  async getTaskById(id: string, organizationId: string): Promise<Task> {
    const task = await this.repository.findByIdAndOrg(id, organizationId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    return task;
  }

  async updateTask(id: string, organizationId: string, data: UpdateTaskDTO): Promise<Task> {
    await this.getTaskById(id, organizationId); 
    
    // Verify new assigned user exists in this org (if being updated)
    if (data.assigned_to) {
      await this.userService.getUserById(data.assigned_to, organizationId);
    }

    const updatedTask = await this.repository.update(id, organizationId, data);
    if (!updatedTask) {
      throw new ApiError(500, 'Failed to update task');
    }
    return updatedTask;
  }

  async deleteTask(id: string, organizationId: string): Promise<void> {
    await this.getTaskById(id, organizationId);
    await this.repository.softDelete(id, organizationId);
  }
}