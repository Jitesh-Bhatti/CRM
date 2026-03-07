import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../errors/ApiError';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Use .issues for Zod v4 and type 'err' explicitly
        const errorMessages = error.issues
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        return next(new ApiError(400, `Validation Failed: ${errorMessages}`));
      }
      return next(error);
    }
  };
};