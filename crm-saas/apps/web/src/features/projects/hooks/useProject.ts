import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../../services/projectService';
import type { ProjectResponse } from '../types';

export const useProject = (id: string) => {
  return useQuery<ProjectResponse, Error>({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
};