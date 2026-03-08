import { ProjectRepository } from '../repositories/project.repository';
import { ClientService } from '../../crm/services/client.service';
import { CreateProjectDTO, UpdateProjectDTO, Project } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class ProjectService {
  private repository: ProjectRepository;
  private clientService: ClientService;

  constructor() {
    this.repository = new ProjectRepository();
    this.clientService = new ClientService();
  }

  async createProject(organizationId: string, userId: string, data: CreateProjectDTO): Promise<Project> {
    // 1. Verify the client exists AND belongs to this organization
    // If it doesn't, this will automatically throw a 404 ApiError.
    await this.clientService.getClientById(data.client_id, organizationId);
    
    // 2. Create the project
    return await this.repository.create(organizationId, userId, data);
  }

  async getAllProjects(organizationId: string): Promise<Project[]> {
    return await this.repository.findAllByOrg(organizationId);
  }

  async getProjectById(id: string, organizationId: string): Promise<Project> {
    const project = await this.repository.findByIdAndOrg(id, organizationId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    return project;
  }

  async updateProject(id: string, organizationId: string, data: UpdateProjectDTO): Promise<Project> {
    await this.getProjectById(id, organizationId); // Verifies project existence
    
    // If they are trying to change the client, verify the new client belongs to the org
    if (data.client_id) {
      await this.clientService.getClientById(data.client_id, organizationId);
    }
    
    const updatedProject = await this.repository.update(id, organizationId, data);
    if (!updatedProject) {
      throw new ApiError(500, 'Failed to update project');
    }
    return updatedProject;
  }

  async deleteProject(id: string, organizationId: string): Promise<void> {
    await this.getProjectById(id, organizationId); // Verifies existence
    await this.repository.softDelete(id, organizationId);
  }
}