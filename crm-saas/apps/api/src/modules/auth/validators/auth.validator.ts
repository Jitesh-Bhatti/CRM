import { z } from 'zod';

export const registerOrganizationSchema = z.object({
  body: z.object({
    organization_name: z.string().min(2, 'Organization name must be at least 2 characters').max(255),
    owner_name: z.string().min(2, 'Owner name must be at least 2 characters').max(255),
    owner_email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});