import { z } from 'zod';

export const createTaskAttachmentSchema = z.object({
  params: z.object({
    taskId: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    file_id: z.string().uuid('Invalid file ID'),
  }),
});