import axios from 'axios';
import type { 
  ClientResponse, 
  ClientsListResponse, 
  CreateClientPayload, 
  UpdateClientPayload 
} from '../features/clients/types';

const API_URL = 'http://localhost:4000/api/v1/crm/clients';

// Helper function to grab the token for our protected routes
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}` // [cite: 78]
    }
  };
};

export const clientService = {
  getAll: async (): Promise<ClientsListResponse> => {
    const response = await axios.get<ClientsListResponse>(API_URL, getAuthHeaders()); // [cite: 83]
    return response.data;
  },

  getById: async (id: string): Promise<ClientResponse> => {
    const response = await axios.get<ClientResponse>(`${API_URL}/${id}`, getAuthHeaders()); // [cite: 84]
    return response.data;
  },

  create: async (payload: CreateClientPayload): Promise<ClientResponse> => {
    const response = await axios.post<ClientResponse>(API_URL, payload, getAuthHeaders()); // [cite: 80]
    return response.data;
  },

  update: async (id: string, payload: UpdateClientPayload): Promise<ClientResponse> => {
    const response = await axios.patch<ClientResponse>(`${API_URL}/${id}`, payload, getAuthHeaders()); // [cite: 86]
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders()); // [cite: 88]
  }
};
