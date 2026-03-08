import axios from 'axios';
import type { 
  ProjectResponse, 
  ProjectsListResponse, 
  CreateProjectPayload, 
  UpdateProjectPayload 
} from '../features/projects/types';

// Updated URL to match your Postman docs exactly
const API_URL = 'http://localhost:4000/api/v1/projects';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const projectService = {
  getAll: async (): Promise<ProjectsListResponse> => {
    const response = await axios.get<ProjectsListResponse>(API_URL, getAuthHeaders());
    return response.data;
  },

  getById: async (id: string): Promise<ProjectResponse> => {
    const response = await axios.get<ProjectResponse>(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  },

  create: async (payload: CreateProjectPayload): Promise<ProjectResponse> => {
    const response = await axios.post<ProjectResponse>(API_URL, payload, getAuthHeaders());
    return response.data;
  },

  update: async (id: string, payload: UpdateProjectPayload): Promise<ProjectResponse> => {
    const response = await axios.patch<ProjectResponse>(`${API_URL}/${id}`, payload, getAuthHeaders());
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  }
};