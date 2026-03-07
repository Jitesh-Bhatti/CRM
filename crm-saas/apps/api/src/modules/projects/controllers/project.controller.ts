import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class ProjectController {
  private service: ProjectService;

  constructor() {
    this.service = new ProjectService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const project = await this.service.createProject(req.user.organizationId, req.user.userId, req.body);
      res.status(201).json(successResponse(project, 'Project created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const projects = await this.service.getAllProjects(req.user.organizationId);
      res.status(200).json(successResponse(projects, 'Projects retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const project = await this.service.getProjectById(req.params.id as string, req.user.organizationId);
      res.status(200).json(successResponse(project, 'Project retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const project = await this.service.updateProject(req.params.id as string, req.user.organizationId, req.body);
      res.status(200).json(successResponse(project, 'Project updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteProject(req.params.id as string, req.user.organizationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}