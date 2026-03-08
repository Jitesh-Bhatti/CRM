import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../../services/projectService';
import type { UpdateProjectPayload, ProjectResponse } from '../types';

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ProjectResponse, Error, { id: string; payload: UpdateProjectPayload }>({
    mutationFn: ({ id, payload }) => projectService.update(id, payload),
   onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
};