import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    company: z.string().max(255).optional(),
    source: z.string().max(150).optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
    assigned_to: z.string().uuid('Invalid user ID').optional(),
    lead_score: z.number().int().min(0).optional(),
    notes: z.string().optional(),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid lead ID'),
  }),
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().max(50).optional(),
    company: z.string().max(255).optional(),
    source: z.string().max(150).optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
    assigned_to: z.string().uuid().optional().nullable(),
    lead_score: z.number().int().min(0).optional(),
    notes: z.string().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});