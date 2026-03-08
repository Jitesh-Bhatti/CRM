import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';
import type { CreateClientPayload, ClientResponse } from '../types';

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<ClientResponse, Error, CreateClientPayload>({
    mutationFn: (payload) => clientService.create(payload),
    onSuccess: () => {
      // Invalidate and refetch the clients list
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};