import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    company_name: z.string().min(2, 'Company name must be at least 2 characters').max(255),
    primary_contact_name: z.string().max(255).optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    address: z.string().optional(),
    country: z.string().max(100).optional(),
    timezone: z.string().max(100).optional(),
    notes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid client ID'),
  }),
  body: z.object({
    company_name: z.string().min(2).max(255).optional(),
    primary_contact_name: z.string().max(255).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    address: z.string().optional(),
    country: z.string().max(100).optional(),
    timezone: z.string().max(100).optional(),
    notes: z.string().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});