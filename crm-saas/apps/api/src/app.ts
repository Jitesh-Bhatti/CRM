import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './errors/errorHandler';
import { successResponse } from '@crm/utils/src/response';
import authRoutes from './modules/auth/routes/routes.index';
import userRoutes from './modules/users/routes';
import crmRoutes from './modules/crm/routes';
import projectRoutes from './modules/projects/routes';
import taskRoutes from './modules/tasks/routes';
import fileRoutes from './modules/files/routes';
import timeEntryRoutes from './modules/time-entries/routes';

const app: Application = express();

// Global Middlewar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(successResponse(null, 'API is healthy and running'));
});

// TODO: Mount modular routes here (e.g., app.use('/api/v1/auth', authRoutes))
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/crm', crmRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/time-entries', timeEntryRoutes);

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

export default app;