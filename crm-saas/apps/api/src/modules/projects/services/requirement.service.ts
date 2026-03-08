import { RequirementRepository } from '../repositories/requirement.repository';
import { ProjectService } from './project.service';
import { CreateProjectRequirementDTO, UpdateProjectRequirementDTO, ProjectRequirement } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class RequirementService {
  private repository: RequirementRepository;
  private projectService: ProjectService;

  constructor() {
    this.repository = new RequirementRepository();
    this.projectService = new ProjectService();
  }

  async createRequirement(organizationId: string, projectId: string, userId: string, data: CreateProjectRequirementDTO): Promise<ProjectRequirement> {
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.create(projectId, userId, data);
  }

  async getAllRequirements(organizationId: string, projectId: string): Promise<ProjectRequirement[]> {
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.findAllByProject(projectId);
  }

  async getRequirementById(organizationId: string, projectId: string, id: string): Promise<ProjectRequirement> {
    await this.projectService.getProjectById(projectId, organizationId);

    const requirement = await this.repository.findByIdAndProject(id, projectId);
    if (!requirement) {
      throw new ApiError(404, 'Requirement not found');
    }
    return requirement;
  }

  async updateRequirement(organizationId: string, projectId: string, id: string, data: UpdateProjectRequirementDTO): Promise<ProjectRequirement> {
    await this.getRequirementById(organizationId, projectId, id); 
    
    const updatedRequirement = await this.repository.update(id, projectId, data);
    if (!updatedRequirement) {
      throw new ApiError(500, 'Failed to update requirement');
    }
    return updatedRequirement;
  }

  async deleteRequirement(organizationId: string, projectId: string, id: string): Promise<void> {
    await this.getRequirementById(organizationId, projectId, id);
    await this.repository.delete(id, projectId);
  }
}