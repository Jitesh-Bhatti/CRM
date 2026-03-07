import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO, User } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(organizationId: string, data: CreateUserDTO): Promise<User> {
    // Check if email already exists in this specific organization
    const existingUser = await this.repository.findByEmailAndOrg(data.email, organizationId);
    if (existingUser) {
      throw new ApiError(409, 'A user with this email already exists in your organization');
    }

    // Note: Creating a user sets them to 'invited'. In a real flow, you'd trigger an email here.
    return await this.repository.create(organizationId, data);
  }

  async getAllUsers(organizationId: string): Promise<User[]> {
    return await this.repository.findAllByOrg(organizationId);
  }

  async getUserById(id: string, organizationId: string): Promise<User> {
    const user = await this.repository.findByIdAndOrg(id, organizationId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async updateUser(id: string, organizationId: string, data: UpdateUserDTO): Promise<User> {
    const user = await this.getUserById(id, organizationId); // Verifies existence & tenant
    
    const updatedUser = await this.repository.update(id, organizationId, data);
    if (!updatedUser) {
      throw new ApiError(500, 'Failed to update user');
    }
    return updatedUser;
  }

  async deleteUser(id: string, organizationId: string): Promise<void> {
    const user = await this.getUserById(id, organizationId);
    
    if (user.is_org_owner) {
      throw new ApiError(403, 'Cannot delete the organization owner');
    }

    await this.repository.softDelete(id, organizationId);
  }
}