import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@crm/config';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterOrganizationDTO, AuthResponse } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async registerOrganization(data: RegisterOrganizationDTO): Promise<AuthResponse> {
    const existingUser = await this.repository.findUserByEmail(data.owner_email);
    if (existingUser) {
      throw new ApiError(409, 'Email is already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await this.repository.createTenantWithOwner({
      ...data,
      passwordHash,
    });

    const token = this.generateToken(user.id, user.organization_id);

    return { user, token };
  }

  private generateToken(userId: string, organizationId: string): string {
    return jwt.sign(
      { userId, organizationId }, 
      env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
  }

  
  async login(data: any): Promise<AuthResponse> {
    // 1. Find user and their password hash
    const userWithCreds = await this.repository.findUserWithCredentialsByEmail(data.email);
    if (!userWithCreds) {
      throw new ApiError(401, 'Invalid email or password'); // Generic message for security
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(data.password, userWithCreds.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 3. Check if user is suspended or inactive
    if (userWithCreds.status !== 'active') {
      throw new ApiError(403, `Account is ${userWithCreds.status}. Please contact support.`);
    }

    // 4. Generate JWT Token
    const token = this.generateToken(userWithCreds.id, userWithCreds.organization_id);

    // Format the response without exposing the password hash
    const { password_hash, ...user } = userWithCreds;

    return { user, token };
  }

 
}

