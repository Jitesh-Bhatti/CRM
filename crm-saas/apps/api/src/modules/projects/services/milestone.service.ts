import { MilestoneRepository } from '../repositories/milestone.repository';
import { ProjectService } from './project.service';
import { CreateMilestoneDTO, UpdateMilestoneDTO, Milestone } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class MilestoneService {
  private repository: MilestoneRepository;
  private projectService: ProjectService;

  constructor() {
    this.repository = new MilestoneRepository();
    this.projectService = new ProjectService();
  }

  async createMilestone(organizationId: string, projectId: string, data: CreateMilestoneDTO): Promise<Milestone> {
    // Verify the project exists and belongs to this organization
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.create(projectId, data);
  }

  async getAllMilestones(organizationId: string, projectId: string): Promise<Milestone[]> {
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.findAllByProject(projectId);
  }

  async getMilestoneById(organizationId: string, projectId: string, id: string): Promise<Milestone> {
    await this.projectService.getProjectById(projectId, organizationId);

    const milestone = await this.repository.findByIdAndProject(id, projectId);
    if (!milestone) {
      throw new ApiError(404, 'Milestone not found');
    }
    return milestone;
  }

  async updateMilestone(organizationId: string, projectId: string, id: string, data: UpdateMilestoneDTO): Promise<Milestone> {
    await this.getMilestoneById(organizationId, projectId, id); 
    
    const updatedMilestone = await this.repository.update(id, projectId, data);
    if (!updatedMilestone) {
      throw new ApiError(500, 'Failed to update milestone');
    }
    return updatedMilestone;
  }

  async deleteMilestone(organizationId: string, projectId: string, id: string): Promise<void> {
    await this.getMilestoneById(organizationId, projectId, id);
    await this.repository.delete(id, projectId);
  }
}