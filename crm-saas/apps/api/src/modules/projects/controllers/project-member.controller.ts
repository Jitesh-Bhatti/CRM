import { Request, Response, NextFunction } from 'express';
import { ProjectMemberService } from '../services/project-member.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class ProjectMemberController {
  private service: ProjectMemberService;

  constructor() {
    this.service = new ProjectMemberService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      
      const member = await this.service.addMember(req.user.organizationId, req.params.projectId as string, req.body);
      res.status(201).json(successResponse(member, 'Member added to project successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const members = await this.service.getAllMembers(req.user.organizationId, req.params.projectId as string);
      res.status(200).json(successResponse(members, 'Project members retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const member = await this.service.getMemberById(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(200).json(successResponse(member, 'Project member retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const member = await this.service.updateMemberRole(req.user.organizationId, req.params.projectId as string, req.params.id as string, req.body);
      res.status(200).json(successResponse(member, 'Member role updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.removeMember(req.user.organizationId, req.params.projectId as string, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}