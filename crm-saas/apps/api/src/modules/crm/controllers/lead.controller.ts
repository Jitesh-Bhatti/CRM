import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class LeadController {
  private service: LeadService;

  constructor() {
    this.service = new LeadService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const lead = await this.service.createLead(req.user.organizationId, req.body);
      res.status(201).json(successResponse(lead, 'Lead created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const leads = await this.service.getAllLeads(req.user.organizationId);
      res.status(200).json(successResponse(leads, 'Leads retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const lead = await this.service.getLeadById(req.params.id as string, req.user.organizationId);
      res.status(200).json(successResponse(lead, 'Lead retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const lead = await this.service.updateLead(req.params.id as string, req.user.organizationId, req.body);
      res.status(200).json(successResponse(lead, 'Lead updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteLead(req.params.id as string, req.user.organizationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}