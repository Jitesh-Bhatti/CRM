import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../../../services/leadService';
import type { UpdateLeadPayload, LeadResponse } from '../types';

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation<LeadResponse, Error, { id: string; payload: UpdateLeadPayload }>({
    mutationFn: ({ id, payload }) => leadService.update(id, payload),
    onSuccess: () => {
      // Refresh the leads list automatically to reflect the new column
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};