import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../../../services/contactService';
import type { CreateContactPayload, ContactResponse } from '../types';

export const useCreateContact = (clientId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ContactResponse, Error, CreateContactPayload>({
    mutationFn: (payload) => contactService.create(clientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId] });
    },
  });
};