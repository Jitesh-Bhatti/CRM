import { ClientContactRepository } from '../repositories/client-contact.repository';
import { ClientService } from './client.service';
import { CreateClientContactDTO, UpdateClientContactDTO, ClientContact } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class ClientContactService {
  private repository: ClientContactRepository;
  private clientService: ClientService;

  constructor() {
    this.repository = new ClientContactRepository();
    this.clientService = new ClientService();
  }

  async createContact(organizationId: string, clientId: string, data: CreateClientContactDTO): Promise<ClientContact> {
    await this.clientService.getClientById(clientId, organizationId);
    return await this.repository.create(clientId, data);
  }

  async getAllContacts(organizationId: string, clientId: string): Promise<ClientContact[]> {
    await this.clientService.getClientById(clientId, organizationId);
    return await this.repository.findAllByClient(clientId);
  }

  async getContactById(organizationId: string, clientId: string, id: string): Promise<ClientContact> {
    await this.clientService.getClientById(clientId, organizationId);

    const contact = await this.repository.findByIdAndClient(id, clientId);
    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }
    return contact;
  }

  async updateContact(organizationId: string, clientId: string, id: string, data: UpdateClientContactDTO): Promise<ClientContact> {
    await this.getContactById(organizationId, clientId, id); 
    
    const updatedContact = await this.repository.update(id, clientId, data);
    if (!updatedContact) {
      throw new ApiError(500, 'Failed to update contact');
    }
    return updatedContact;
  }

  async deleteContact(organizationId: string, clientId: string, id: string): Promise<void> {
    await this.getContactById(organizationId, clientId, id); 
    await this.repository.softDelete(id, clientId); 
  }
}