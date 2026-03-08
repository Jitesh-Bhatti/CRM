import { useQuery } from '@tanstack/react-query';
import { clientService } from '../../../services/clientService';
import type { ClientsListResponse } from '../types';

export const useClients = () => {
  return useQuery<ClientsListResponse, Error>({
    queryKey: ['clients'],
    queryFn: clientService.getAll,
  });
};