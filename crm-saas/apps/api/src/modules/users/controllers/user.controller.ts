import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const user = await this.service.createUser(req.user.organizationId, req.body);
      res.status(201).json(successResponse(user, 'User invited successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const users = await this.service.getAllUsers(req.user.organizationId);
      res.status(200).json(successResponse(users, 'Users retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const user = await this.service.getUserById(req.params.id, req.user.organizationId);
      res.status(200).json(successResponse(user, 'User retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const user = await this.service.updateUser(req.params.id, req.user.organizationId, req.body);
      res.status(200).json(successResponse(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteUser(req.params.id, req.user.organizationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}