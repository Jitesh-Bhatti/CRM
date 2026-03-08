import { Request, Response, NextFunction } from 'express';
import { RequirementService } from '../services/requirement.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class RequirementController {
  private service: RequirementService;

  constructor() {
    this.service = new RequirementService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const requirement = await this.service.createRequirement(req.user.organizationId, req.params.projectId as string, req.user.userId, req.body);
      res.status(201).json(successResponse(requirement, 'Requirement added successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const requirements = await this.service.getAllRequirements(req.user.organizationId, req.params.projectId as string);
      res.status(200).json(successResponse(requirements, 'Requirements retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const requirement = await this.service.getRequirementById(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(200).json(successResponse(requirement, 'Requirement retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const requirement = await this.service.updateRequirement(req.user.organizationId, req.params.projectId as string, req.params.id as string, req.body);
      res.status(200).json(successResponse(requirement, 'Requirement updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteRequirement(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}