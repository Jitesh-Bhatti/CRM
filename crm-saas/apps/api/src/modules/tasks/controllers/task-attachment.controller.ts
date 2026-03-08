import { Request, Response, NextFunction } from 'express';
import { TaskAttachmentService } from '../services/task-attachment.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class TaskAttachmentController {
  private service: TaskAttachmentService;

  constructor() {
    this.service = new TaskAttachmentService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const attachment = await this.service.attachFile(req.user.organizationId, req.params.taskId as string, req.body);
      res.status(201).json(successResponse(attachment, 'File attached to task successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const attachments = await this.service.getAllAttachments(req.user.organizationId, req.params.taskId as string);
      res.status(200).json(successResponse(attachments, 'Task attachments retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.detachFile(req.user.organizationId, req.params.taskId as string, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}