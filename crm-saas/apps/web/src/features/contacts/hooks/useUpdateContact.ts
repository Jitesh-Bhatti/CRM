import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../../../services/contactService';
import type { UpdateContactPayload, ContactResponse } from '../types';

export const useUpdateContact = (clientId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ContactResponse, Error, { contactId: string; payload: UpdateContactPayload }>({
    mutationFn: ({ contactId, payload }) => contactService.update(clientId, contactId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId] });
    },
  });
};