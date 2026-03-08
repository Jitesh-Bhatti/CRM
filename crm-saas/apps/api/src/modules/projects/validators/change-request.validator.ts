import { z } from 'zod';

export const createChangeRequestSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    description: z.string().min(10, 'Description must be at least 10 characters'),
  }),
});

export const updateChangeRequestSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    id: z.string().uuid('Invalid change request ID'),
  }),
  body: z.object({
    description: z.string().min(10).optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});