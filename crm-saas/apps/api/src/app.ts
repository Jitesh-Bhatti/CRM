import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './errors/errorHandler';
import { successResponse } from '@crm/utils/src/response';
import authRoutes from './modules/auth/routes/routes.index';

const app: Application = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(successResponse(null, 'API is healthy and running'));
});

// TODO: Mount modular routes here (e.g., app.use('/api/v1/auth', authRoutes))
app.use('/api/v1/auth', authRoutes);

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

export default app;