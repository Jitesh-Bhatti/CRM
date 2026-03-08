import { Request, Response, NextFunction } from 'express';
import { TaskCommentService } from '../services/task-comment.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class TaskCommentController {
  private service: TaskCommentService;

  constructor() {
    this.service = new TaskCommentService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const comment = await this.service.createComment(req.user.organizationId, req.params.taskId as string, req.user.userId, req.body);
      res.status(201).json(successResponse(comment, 'Comment posted successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const comments = await this.service.getAllComments(req.user.organizationId, req.params.taskId as string);
      res.status(200).json(successResponse(comments, 'Comments retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const comment = await this.service.getCommentById(req.user.organizationId, req.params.taskId as string, req.params.id as string);
      res.status(200).json(successResponse(comment, 'Comment retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const comment = await this.service.updateComment(req.user.organizationId, req.params.taskId as string, req.params.id as string, req.user.userId, req.body);
      res.status(200).json(successResponse(comment, 'Comment updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteComment(req.user.organizationId, req.params.taskId as string, req.params.id as string, req.user.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}