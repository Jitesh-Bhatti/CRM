import { Request, Response, NextFunction } from 'express';
import { ClientContactService } from '../services/client-contact.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class ClientContactController {
  private service: ClientContactService;

  constructor() {
    this.service = new ClientContactService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const contact = await this.service.createContact(req.user.organizationId, req.params.clientId as string, req.body);
      res.status(201).json(successResponse(contact, 'Contact created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const contacts = await this.service.getAllContacts(req.user.organizationId, req.params.clientId as string);
      res.status(200).json(successResponse(contacts, 'Contacts retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const contact = await this.service.getContactById(req.user.organizationId, req.params.clientId as string, req.params.id as string);
      res.status(200).json(successResponse(contact, 'Contact retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const contact = await this.service.updateContact(req.user.organizationId, req.params.clientId as string, req.params.id as string, req.body);
      res.status(200).json(successResponse(contact, 'Contact updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteContact(req.user.organizationId, req.params.clientId as string, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}