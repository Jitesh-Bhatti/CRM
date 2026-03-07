import { z } from 'zod';

export const createClientContactSchema = z.object({
  params: z.object({
    clientId: z.string().uuid('Invalid client ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    job_title: z.string().max(255).optional(),
    is_primary: z.boolean().optional(),
  }),
});

export const updateClientContactSchema = z.object({
  params: z.object({
    clientId: z.string().uuid('Invalid client ID'),
    id: z.string().uuid('Invalid contact ID'),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    job_title: z.string().max(255).optional(),
    is_primary: z.boolean().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});