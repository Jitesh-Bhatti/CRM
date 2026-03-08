import { Request, Response, NextFunction } from 'express';
import { TimeEntryService } from '../services/time-entry.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class TimeEntryController {
  private service: TimeEntryService;

  constructor() {
    this.service = new TimeEntryService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const entry = await this.service.createTimeEntry(req.user.organizationId, req.user.userId, req.body);
      res.status(201).json(successResponse(entry, 'Time entry logged successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const projectId = req.query.projectId as string | undefined;
      const userId = req.query.userId as string | undefined;

      const entries = await this.service.getAllTimeEntries(req.user.organizationId, projectId, userId);
      res.status(200).json(successResponse(entries, 'Time entries retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const entry = await this.service.getTimeEntryById(req.params.id as string, req.user.organizationId);
      res.status(200).json(successResponse(entry, 'Time entry retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const entry = await this.service.updateTimeEntry(req.params.id as string, req.user.organizationId, req.user.userId, req.body);
      res.status(200).json(successResponse(entry, 'Time entry updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteTimeEntry(req.params.id as string, req.user.organizationId, req.user.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}