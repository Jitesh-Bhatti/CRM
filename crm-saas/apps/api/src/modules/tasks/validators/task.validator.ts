import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createTaskSchema = z.object({
  body: z.object({
    project_id: z.string().uuid('Invalid project ID'),
    title: z.string().min(2, 'Title must be at least 2 characters').max(255),
    description: z.string().optional(),
    assigned_to: z.string().uuid('Invalid user ID').optional().nullable(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    status: z.enum(['todo', 'in_progress', 'review', 'completed']).optional(),
    deadline: z.string().regex(dateRegex, 'Deadline must be YYYY-MM-DD').optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    title: z.string().min(2).max(255).optional(),
    description: z.string().optional(),
    assigned_to: z.string().uuid('Invalid user ID').optional().nullable(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    status: z.enum(['todo', 'in_progress', 'review', 'completed']).optional(),
    deadline: z.string().regex(dateRegex, 'Deadline must be YYYY-MM-DD').optional().nullable(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});