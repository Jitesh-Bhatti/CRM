import { LeadRepository } from '../repositories/lead.repository';
import { CreateLeadDTO, UpdateLeadDTO, Lead } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class LeadService {
  private repository: LeadRepository;

  constructor() {
    this.repository = new LeadRepository();
  }

  async createLead(organizationId: string, data: CreateLeadDTO): Promise<Lead> {
    // Check constraint: unique email & company combo per organization
    if (data.email && data.company) {
      const existing = await this.repository.findByEmailAndCompany(organizationId, data.email, data.company);
      if (existing) {
        throw new ApiError(409, 'A lead with this email and company already exists');
      }
    }
    return await this.repository.create(organizationId, data);
  }

  async getAllLeads(organizationId: string): Promise<Lead[]> {
    return await this.repository.findAllByOrg(organizationId);
  }

  async getLeadById(id: string, organizationId: string): Promise<Lead> {
    const lead = await this.repository.findByIdAndOrg(id, organizationId);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }
    return lead;
  }

  async updateLead(id: string, organizationId: string, data: UpdateLeadDTO): Promise<Lead> {
    await this.getLeadById(id, organizationId); // Verify existence and ownership
    
    const updatedLead = await this.repository.update(id, organizationId, data);
    if (!updatedLead) {
      throw new ApiError(500, 'Failed to update lead');
    }
    return updatedLead;
  }

  async deleteLead(id: string, organizationId: string): Promise<void> {
    await this.getLeadById(id, organizationId);
    await this.repository.softDelete(id, organizationId);
  }
}