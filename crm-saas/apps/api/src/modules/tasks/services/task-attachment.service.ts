import { TaskAttachmentRepository } from '../repositories/task-attachment.repository';
import { TaskService } from './task.service';
import { CreateTaskAttachmentDTO, TaskAttachment } from '../types';
import { ApiError } from '../../../errors/ApiError';
import { db } from '@crm/database';

export class TaskAttachmentService {
  private repository: TaskAttachmentRepository;
  private taskService: TaskService;

  constructor() {
    this.repository = new TaskAttachmentRepository();
    this.taskService = new TaskService();
  }

  async attachFile(organizationId: string, taskId: string, data: CreateTaskAttachmentDTO): Promise<TaskAttachment> {
    // 1. Verify task belongs to this organization
    await this.taskService.getTaskById(taskId, organizationId);

    // 2. Verify file exists AND belongs to this organization
    const fileCheck = await db.query(
      `SELECT id FROM files WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL`, 
      [data.file_id, organizationId]
    );

    if (fileCheck.rows.length === 0) {
      throw new ApiError(404, 'File not found or does not belong to your organization');
    }

    // 3. Attach it
    return await this.repository.attach(taskId, data);
  }

  async getAllAttachments(organizationId: string, taskId: string): Promise<any[]> {
    await this.taskService.getTaskById(taskId, organizationId);
    return await this.repository.findAllByTask(taskId);
  }

  async detachFile(organizationId: string, taskId: string, id: string): Promise<void> {
    await this.taskService.getTaskById(taskId, organizationId);
    
    const attachment = await this.repository.findByIdAndTask(id, taskId);
    if (!attachment) {
      throw new ApiError(404, 'Attachment not found on this task');
    }

    await this.repository.detach(id, taskId);
  }
}