import { ChangeRequestRepository } from '../repositories/change-request.repository';
import { ProjectService } from './project.service';
import { CreateChangeRequestDTO, UpdateChangeRequestDTO, ChangeRequest } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class ChangeRequestService {
  private repository: ChangeRequestRepository;
  private projectService: ProjectService;

  constructor() {
    this.repository = new ChangeRequestRepository();
    this.projectService = new ProjectService();
  }

  async createChangeRequest(organizationId: string, projectId: string, userId: string, data: CreateChangeRequestDTO): Promise<ChangeRequest> {
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.create(projectId, userId, data);
  }

  async getAllChangeRequests(organizationId: string, projectId: string): Promise<ChangeRequest[]> {
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.findAllByProject(projectId);
  }

  async getChangeRequestById(organizationId: string, projectId: string, id: string): Promise<ChangeRequest> {
    await this.projectService.getProjectById(projectId, organizationId);

    const changeRequest = await this.repository.findByIdAndProject(id, projectId);
    if (!changeRequest) {
      throw new ApiError(404, 'Change request not found');
    }
    return changeRequest;
  }

  async updateChangeRequest(organizationId: string, projectId: string, id: string, userId: string, data: UpdateChangeRequestDTO): Promise<ChangeRequest> {
    await this.getChangeRequestById(organizationId, projectId, id); 
    
    const updatePayload: any = { ...data };
    
    // Auto-fill the approved_by column based on the status change
    if (data.status === 'approved' || data.status === 'rejected') {
      updatePayload.approved_by = userId;
    } else if (data.status === 'pending') {
      updatePayload.approved_by = null; // Reset if moved back to pending
    }

    const updatedChangeRequest = await this.repository.update(id, projectId, updatePayload);
    if (!updatedChangeRequest) {
      throw new ApiError(500, 'Failed to update change request');
    }
    return updatedChangeRequest;
  }

  async deleteChangeRequest(organizationId: string, projectId: string, id: string): Promise<void> {
    await this.getChangeRequestById(organizationId, projectId, id);
    await this.repository.delete(id, projectId);
  }
}