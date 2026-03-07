import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/client.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class ClientController {
  private service: ClientService;

  constructor() {
    this.service = new ClientService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const client = await this.service.createClient(req.user.organizationId, req.user.userId, req.body);
      res.status(201).json(successResponse(client, 'Client created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const clients = await this.service.getAllClients(req.user.organizationId);
      res.status(200).json(successResponse(clients, 'Clients retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const client = await this.service.getClientById(req.params.id as string, req.user.organizationId);
      res.status(200).json(successResponse(client, 'Client retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const client = await this.service.updateClient(req.params.id as string, req.user.organizationId, req.body);
      res.status(200).json(successResponse(client, 'Client updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteClient(req.params.id as string, req.user.organizationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}