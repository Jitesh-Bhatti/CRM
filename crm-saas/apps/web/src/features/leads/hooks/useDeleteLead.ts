import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../../../services/leadService';

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};