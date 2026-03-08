import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services/authService';
import type { RegisterOrganizationPayload, AuthResponse } from '../types';
import { useAuthStore } from '../../../store/useAuthStore';

export const useRegisterOrganization = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, RegisterOrganizationPayload>({
    mutationFn: (payload) => authService.registerOrganization(payload),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
      }
    },
  });
};