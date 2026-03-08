import { z } from 'zod';

export const createTaskCommentSchema = z.object({
  params: z.object({
    taskId: z.string().uuid('Invalid task ID'),
  }),
  body: z.object({
    comment_text: z.string().min(1, 'Comment cannot be empty'),
  }),
});

export const updateTaskCommentSchema = z.object({
  params: z.object({
    taskId: z.string().uuid('Invalid task ID'),
    id: z.string().uuid('Invalid comment ID'),
  }),
  body: z.object({
    comment_text: z.string().min(1, 'Comment cannot be empty'),
  }),
});