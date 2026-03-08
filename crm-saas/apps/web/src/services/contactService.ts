import axios from 'axios';
import type { 
  ContactResponse, 
  ContactsListResponse, 
  CreateContactPayload, 
  UpdateContactPayload 
} from '../features/contacts/types';

// Helper to generate the nested URL
const getBaseUrl = (clientId: string) => `http://localhost:4000/api/v1/crm/clients/${clientId}/contacts`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const contactService = {
  getAll: async (clientId: string): Promise<ContactsListResponse> => {
    const response = await axios.get<ContactsListResponse>(getBaseUrl(clientId), getAuthHeaders());
    return response.data;
  },
  getById: async (clientId: string, contactId: string): Promise<ContactResponse> => {
    const response = await axios.get<ContactResponse>(`${getBaseUrl(clientId)}/${contactId}`, getAuthHeaders());
    return response.data;
  },
  create: async (clientId: string, payload: CreateContactPayload): Promise<ContactResponse> => {
    const response = await axios.post<ContactResponse>(getBaseUrl(clientId), payload, getAuthHeaders());
    return response.data;
  },
  update: async (clientId: string, contactId: string, payload: UpdateContactPayload): Promise<ContactResponse> => {
    const response = await axios.patch<ContactResponse>(`${getBaseUrl(clientId)}/${contactId}`, payload, getAuthHeaders());
    return response.data;
  },
  delete: async (clientId: string, contactId: string): Promise<void> => {
    await axios.delete(`${getBaseUrl(clientId)}/${contactId}`, getAuthHeaders());
  }
};