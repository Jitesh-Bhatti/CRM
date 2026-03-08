import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service';
import { successResponse } from '@crm/utils/src/response';
import { ApiError } from '../../../errors/ApiError';

export class FileController {
  private service: FileService;

  constructor() {
    this.service = new FileService();
  }

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');
      if (!req.file) throw new ApiError(400, 'No file provided');
      
      const fileRecord = await this.service.saveFileMetadata(
        req.user.organizationId, 
        req.user.userId, 
        req.file, 
        req.body
      );
      
      res.status(201).json(successResponse(fileRecord, 'File uploaded successfully'));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const { entity_type, entity_id } = req.query;

      const files = await this.service.getFiles(
        req.user.organizationId, 
        entity_type as string, 
        entity_id as string
      );
      
      res.status(200).json(successResponse(files, 'Files retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      const file = await this.service.getFileById(req.params.id as string, req.user.organizationId);
      res.status(200).json(successResponse(file, 'File retrieved successfully'));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new ApiError(401, 'Unauthorized');

      await this.service.deleteFile(req.params.id as string, req.user.organizationId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}