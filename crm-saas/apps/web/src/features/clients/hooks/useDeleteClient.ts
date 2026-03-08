import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => clientService.delete(id),
    onSuccess: () => {
      // Invalidate and refetch the clients list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};