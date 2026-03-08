import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../../../services/leadService';
import type { CreateLeadPayload, LeadResponse } from '../types';

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation<LeadResponse, Error, CreateLeadPayload>({
    mutationFn: (payload) => leadService.create(payload),
    onSuccess: () => {
      // Refresh the leads list automatically
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};