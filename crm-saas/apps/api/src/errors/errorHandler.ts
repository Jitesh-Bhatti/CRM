import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';
import { errorResponse } from '@crm/utils/src/response'; // Assuming direct path if not exported from index
import { logger } from '@crm/utils/src/logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // Log unexpected errors
    logger.error(`Unexpected Error: ${err.message}`, err.stack);
  }

  // Use our standard response formatter
  res.status(statusCode).json(errorResponse(message));
};