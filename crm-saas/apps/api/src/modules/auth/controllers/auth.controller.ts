import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '@crm/utils/src/response';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  registerOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.registerOrganization(req.body);
      res.status(201).json(successResponse(result, 'Organization and owner created successfully'));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body);
      res.status(200).json(successResponse(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  };

 
}

