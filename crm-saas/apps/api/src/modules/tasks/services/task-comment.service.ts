import { TaskCommentRepository } from '../repositories/task-comment.repository';
import { TaskService } from './task.service';
import { CreateTaskCommentDTO, UpdateTaskCommentDTO, TaskComment } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class TaskCommentService {
  private repository: TaskCommentRepository;
  private taskService: TaskService;

  constructor() {
    this.repository = new TaskCommentRepository();
    this.taskService = new TaskService();
  }

  async createComment(organizationId: string, taskId: string, userId: string, data: CreateTaskCommentDTO): Promise<TaskComment> {
    // Verify the task exists and belongs to the user's organization
    await this.taskService.getTaskById(taskId, organizationId);
    return await this.repository.create(taskId, userId, data);
  }

  async getAllComments(organizationId: string, taskId: string): Promise<TaskComment[]> {
    await this.taskService.getTaskById(taskId, organizationId);
    return await this.repository.findAllByTask(taskId);
  }

  async getCommentById(organizationId: string, taskId: string, id: string): Promise<TaskComment> {
    await this.taskService.getTaskById(taskId, organizationId);

    const comment = await this.repository.findByIdAndTask(id, taskId);
    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }
    return comment;
  }

  async updateComment(organizationId: string, taskId: string, id: string, userId: string, data: UpdateTaskCommentDTO): Promise<TaskComment> {
    const comment = await this.getCommentById(organizationId, taskId, id); 
    
    // Ownership check: Only the user who created the comment can edit it
    if (comment.user_id !== userId) {
      throw new ApiError(403, 'You can only edit your own comments');
    }

    const updatedComment = await this.repository.update(id, taskId, data);
    if (!updatedComment) {
      throw new ApiError(500, 'Failed to update comment');
    }
    return updatedComment;
  }

  async deleteComment(organizationId: string, taskId: string, id: string, userId: string): Promise<void> {
    const comment = await this.getCommentById(organizationId, taskId, id);
    
    // Ownership check: Only the user who created the comment can delete it
    if (comment.user_id !== userId) {
      throw new ApiError(403, 'You can only delete your own comments');
    }

    await this.repository.delete(id, taskId);
  }
}