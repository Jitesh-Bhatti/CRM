import axios from 'axios';
// Add the 'type' keyword here!
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterOrganizationPayload 
} from '../features/auth/types';

const API_URL = 'http://localhost:4000/api/v1/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
    return response.data;
  },

  registerOrganization: async (payload: RegisterOrganizationPayload): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register-organization`, payload);
    return response.data;
  }
};