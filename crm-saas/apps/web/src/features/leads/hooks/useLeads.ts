import { useQuery } from '@tanstack/react-query';
import { leadService } from '../../../services/leadService';
import type { LeadsListResponse } from '../types';

export const useLeads = () => {
  return useQuery<LeadsListResponse, Error>({
    queryKey: ['leads'],
    queryFn: leadService.getAll,
  });
};