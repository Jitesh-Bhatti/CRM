import { useQuery } from '@tanstack/react-query';
import { contactService } from '../../../services/contactService';
import type { ContactsListResponse } from '../types';

export const useContacts = (clientId: string) => {
  return useQuery<ContactsListResponse, Error>({
    queryKey: ['contacts', clientId],
    queryFn: () => contactService.getAll(clientId),
    enabled: !!clientId, 
  });
};