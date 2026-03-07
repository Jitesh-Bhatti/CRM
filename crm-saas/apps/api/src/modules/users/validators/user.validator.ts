import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(50).optional(),
    timezone: z.string().max(100).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    phone: z.string().max(50).optional(),
    timezone: z.string().max(100).optional(),
    status: z.enum(['active', 'invited', 'suspended']).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});