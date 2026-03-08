import { z } from 'zod';

export const uploadFileSchema = z.object({
  body: z.object({
    entity_type: z.enum(['project', 'task', 'client']).optional(),
    entity_id: z.string().uuid('Invalid entity ID').optional(),
  }),
});