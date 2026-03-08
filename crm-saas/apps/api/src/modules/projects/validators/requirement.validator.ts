import { z } from 'zod';

export const createRequirementSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    requirement_text: z.string().min(5, 'Requirement text must be at least 5 characters'),
  }),
});

export const updateRequirementSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    id: z.string().uuid('Invalid requirement ID'),
  }),
  body: z.object({
    requirement_text: z.string().min(5).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});