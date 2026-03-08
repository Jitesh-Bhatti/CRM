import { Request, Response, NextFunction } from 'express';
import { MilestoneService } from '../services/milestone.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class MilestoneController {
  private service: MilestoneService;

  constructor() {
    this.service = new MilestoneService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const milestone = await this.service.createMilestone(req.user.organizationId, req.params.projectId as string, req.body);
      res.status(201).json(successResponse(milestone, 'Milestone created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const milestones = await this.service.getAllMilestones(req.user.organizationId, req.params.projectId as string);
      res.status(200).json(successResponse(milestones, 'Milestones retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const milestone = await this.service.getMilestoneById(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(200).json(successResponse(milestone, 'Milestone retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const milestone = await this.service.updateMilestone(req.user.organizationId, req.params.projectId as string, req.params.id as string, req.body);
      res.status(200).json(successResponse(milestone, 'Milestone updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteMilestone(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}