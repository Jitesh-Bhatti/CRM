import { z } from 'zod';

export const createTimeEntrySchema = z.object({
  body: z.object({
    project_id: z.string().uuid('Invalid project ID'),
    task_id: z.string().uuid('Invalid task ID').optional().nullable(),
    hours: z.number().positive('Hours must be greater than 0'),
    description: z.string().optional(),
    billable: z.boolean().optional(),
  }),
});

export const updateTimeEntrySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid time entry ID'),
  }),
  body: z.object({
    task_id: z.string().uuid('Invalid task ID').optional().nullable(),
    hours: z.number().positive().optional(),
    description: z.string().optional(),
    billable: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});