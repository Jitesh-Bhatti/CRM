import { ProjectMemberRepository } from '../repositories/project-member.repository';
import { ProjectService } from './project.service';
import { UserService } from '../../users/services/user.service';
import { CreateProjectMemberDTO, UpdateProjectMemberDTO, ProjectMember } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class ProjectMemberService {
  private repository: ProjectMemberRepository;
  private projectService: ProjectService;
  private userService: UserService;

  constructor() {
    this.repository = new ProjectMemberRepository();
    this.projectService = new ProjectService();
    this.userService = new UserService();
  }

  async addMember(organizationId: string, projectId: string, data: CreateProjectMemberDTO): Promise<ProjectMember> {
    // 1. Verify project belongs to the org
    await this.projectService.getProjectById(projectId, organizationId);
    
    // 2. Verify the user belongs to the org
    await this.userService.getUserById(data.user_id, organizationId);

    // 3. Check if user is already a member to prevent unique constraint DB errors
    const existingMember = await this.repository.findByUserAndProject(data.user_id, projectId);
    if (existingMember) {
      throw new ApiError(409, 'User is already a member of this project');
    }

    return await this.repository.create(projectId, data);
  }

  async getAllMembers(organizationId: string, projectId: string): Promise<ProjectMember[]> {
    await this.projectService.getProjectById(projectId, organizationId);
    return await this.repository.findAllByProject(projectId);
  }

  async getMemberById(organizationId: string, projectId: string, id: string): Promise<ProjectMember> {
    await this.projectService.getProjectById(projectId, organizationId);

    const member = await this.repository.findByIdAndProject(id, projectId);
    if (!member) {
      throw new ApiError(404, 'Project member not found');
    }
    return member;
  }

  async updateMemberRole(organizationId: string, projectId: string, id: string, data: UpdateProjectMemberDTO): Promise<ProjectMember> {
    await this.getMemberById(organizationId, projectId, id);
    
    const updatedMember = await this.repository.update(id, projectId, data);
    if (!updatedMember) {
      throw new ApiError(500, 'Failed to update member role');
    }
    return updatedMember;
  }

  async removeMember(organizationId: string, projectId: string, id: string): Promise<void> {
    await this.getMemberById(organizationId, projectId, id);
    await this.repository.delete(id, projectId);
  }
}