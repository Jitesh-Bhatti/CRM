import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../../../services/contactService';

export const useDeleteContact = (clientId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (contactId) => contactService.delete(clientId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', clientId] });
    },
  });
};