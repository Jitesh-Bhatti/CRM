import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../services/authService';
import type { LoginCredentials, AuthResponse } from '../types';
import { useAuthStore } from '../../../store/useAuthStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth(response.data.user, response.data.token);
      }
    },
  });
};