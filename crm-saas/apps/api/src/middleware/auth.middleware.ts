import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@crm/config';
import { ApiError } from '../errors/ApiError';

interface DecodedToken {
  userId: string;
  organizationId: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;

      // Attach user data to request for downstream controllers
      req.user = {
        userId: decoded.userId,
        organizationId: decoded.organizationId,
      };

      next();
    } catch (tokenError) {
      if (tokenError instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Unauthorized: Token expired');
      }
      throw new ApiError(401, 'Unauthorized: Invalid token');
    }
  } catch (error) {
    next(error);
  }
};