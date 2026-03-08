import { z } from 'zod';

export const createProjectMemberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    user_id: z.string().uuid('Invalid user ID'),
    role_in_project: z.string().max(150).optional(),
  }),
});

export const updateProjectMemberSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    id: z.string().uuid('Invalid member ID'),
  }),
  body: z.object({
    role_in_project: z.string().min(1, 'Role cannot be empty').max(150),
  }),
});