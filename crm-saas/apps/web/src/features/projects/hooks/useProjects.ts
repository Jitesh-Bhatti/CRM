import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../../services/projectService';
import type { ProjectsListResponse } from '../types';

export const useProjects = () => {
  return useQuery<ProjectsListResponse, Error>({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  });
};