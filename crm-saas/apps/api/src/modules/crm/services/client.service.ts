import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDTO, UpdateClientDTO, Client } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class ClientService {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  async createClient(organizationId: string, userId: string, data: CreateClientDTO): Promise<Client> {
    return await this.repository.create(organizationId, userId, data);
  }

  async getAllClients(organizationId: string): Promise<Client[]> {
    return await this.repository.findAllByOrg(organizationId);
  }

  async getClientById(id: string, organizationId: string): Promise<Client> {
    const client = await this.repository.findByIdAndOrg(id, organizationId);
    if (!client) {
      throw new ApiError(404, 'Client not found');
    }
    return client;
  }

  async updateClient(id: string, organizationId: string, data: UpdateClientDTO): Promise<Client> {
    await this.getClientById(id, organizationId); // Verify existence and tenant ownership
    
    const updatedClient = await this.repository.update(id, organizationId, data);
    if (!updatedClient) {
      throw new ApiError(500, 'Failed to update client');
    }
    return updatedClient;
  }

  async deleteClient(id: string, organizationId: string): Promise<void> {
    await this.getClientById(id, organizationId); // Verify existence
    await this.repository.softDelete(id, organizationId);
  }
}