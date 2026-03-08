import axios from 'axios';
// NOTICE THE 'type' KEYWORD HERE! This fixes the verbatimModuleSyntax error.
import type { 
  LeadResponse, 
  LeadsListResponse, 
  CreateLeadPayload, 
  UpdateLeadPayload 
} from '../features/leads/types';

const API_URL = 'http://localhost:4000/api/v1/crm/leads';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const leadService = {
  getAll: async (): Promise<LeadsListResponse> => {
    const response = await axios.get<LeadsListResponse>(API_URL, getAuthHeaders());
    return response.data;
  },

  getById: async (id: string): Promise<LeadResponse> => {
    const response = await axios.get<LeadResponse>(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  create: async (payload: CreateLeadPayload): Promise<LeadResponse> => {
    const response = await axios.post<LeadResponse>(API_URL, payload, getAuthHeaders());
    return response.data;
  },

  update: async (id: string, payload: UpdateLeadPayload): Promise<LeadResponse> => {
    const response = await axios.patch<LeadResponse>(`${API_URL}/${id}`, payload, getAuthHeaders());
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  }
};