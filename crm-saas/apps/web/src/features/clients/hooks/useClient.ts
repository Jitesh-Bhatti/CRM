import { useQuery } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';
import type { ClientResponse } from '../types';

export const useClient = (id: string) => {
  return useQuery<ClientResponse, Error>({
    queryKey: ['client', id],
    queryFn: () => clientService.getById(id),
    enabled: !!id, // Only run if we actually have an ID
  });
};