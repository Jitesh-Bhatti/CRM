import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createProjectSchema = z.object({
  body: z.object({
    client_id: z.string().uuid('Invalid client ID'),
    name: z.string().min(2, 'Project name must be at least 2 characters').max(255),
    project_type: z.string().max(150).optional(),
    description: z.string().optional(),
    start_date: z.string().regex(dateRegex, 'Start date must be YYYY-MM-DD').optional(),
    end_date: z.string().regex(dateRegex, 'End date must be YYYY-MM-DD').optional(),
    status: z.enum(['planning', 'active', 'completed', 'on_hold']).optional(),
    budget: z.number().min(0, 'Budget cannot be negative').optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    client_id: z.string().uuid().optional(),
    name: z.string().min(2).max(255).optional(),
    project_type: z.string().max(150).optional(),
    description: z.string().optional(),
    start_date: z.string().regex(dateRegex, 'Start date must be YYYY-MM-DD').optional().nullable(),
    end_date: z.string().regex(dateRegex, 'End date must be YYYY-MM-DD').optional().nullable(),
    status: z.enum(['planning', 'active', 'completed', 'on_hold']).optional(),
    budget: z.number().min(0).optional().nullable(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});