import { Request, Response, NextFunction } from 'express';
import { ChangeRequestService } from '../services/change-request.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class ChangeRequestController {
  private service: ChangeRequestService;

  constructor() {
    this.service = new ChangeRequestService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const changeRequest = await this.service.createChangeRequest(req.user.organizationId, req.params.projectId as string, req.user.userId, req.body);
      res.status(201).json(successResponse(changeRequest, 'Change request created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const changeRequests = await this.service.getAllChangeRequests(req.user.organizationId, req.params.projectId as string);
      res.status(200).json(successResponse(changeRequests, 'Change requests retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const changeRequest = await this.service.getChangeRequestById(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(200).json(successResponse(changeRequest, 'Change request retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const changeRequest = await this.service.updateChangeRequest(req.user.organizationId, req.params.projectId as string, req.params.id as string, req.user.userId, req.body);
      res.status(200).json(successResponse(changeRequest, 'Change request updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteChangeRequest(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}