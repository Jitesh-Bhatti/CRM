import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class TaskController {
  private service: TaskService;

  constructor() {
    this.service = new TaskService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const task = await this.service.createTask(req.user.organizationId, req.user.userId, req.body);
      res.status(201).json(successResponse(task, 'Task created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      // Allow optional ?projectId=xxx filtering via query params
      const projectId = req.query.projectId as string | undefined;

      const tasks = await this.service.getAllTasks(req.user.organizationId, projectId);
      res.status(200).json(successResponse(tasks, 'Tasks retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const task = await this.service.getTaskById(req.params.id as string, req.user.organizationId);
      res.status(200).json(successResponse(task, 'Task retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const task = await this.service.updateTask(req.params.id as string, req.user.organizationId, req.body);
      res.status(200).json(successResponse(task, 'Task updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteTask(req.params.id as string, req.user.organizationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}