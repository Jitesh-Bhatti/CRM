import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../../services/projectService';
import type { CreateProjectPayload, ProjectResponse } from '../types';

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ProjectResponse, Error, CreateProjectPayload>({
    mutationFn: (payload) => projectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};