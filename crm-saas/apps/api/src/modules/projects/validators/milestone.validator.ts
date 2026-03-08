import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createMilestoneSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(255),
    description: z.string().optional(),
    deadline: z.string().regex(dateRegex, 'Deadline must be YYYY-MM-DD').optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    approval_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }),
});

export const updateMilestoneSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    id: z.string().uuid('Invalid milestone ID'),
  }),
  body: z.object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().optional(),
    deadline: z.string().regex(dateRegex, 'Deadline must be YYYY-MM-DD').optional().nullable(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    approval_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});