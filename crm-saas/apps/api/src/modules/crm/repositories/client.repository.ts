import { db } from '@crm/database';
import { CreateClientDTO, UpdateClientDTO, Client } from '../types';

export class ClientRepository {
  async create(organizationId: string, userId: string, data: CreateClientDTO): Promise<Client> {
    const query = `
      INSERT INTO clients (
        organization_id, created_by, company_name, primary_contact_name, 
        email, phone, address, country, timezone, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      organizationId,
      userId,
      data.company_name,
      data.primary_contact_name || null,
      data.email || null,
      data.phone || null,
      data.address || null,
      data.country || null,
      data.timezone || null,
      data.notes || null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string): Promise<Client[]> {
    const query = `
      SELECT * FROM clients 
      WHERE organization_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<Client | null> {
    const query = `
      SELECT * FROM clients 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async update(id: string, organizationId: string, data: UpdateClientDTO): Promise<Client | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${queryIndex}`);
        values.push(value);
        queryIndex++;
      }
    });

    if (updates.length === 0) return this.findByIdAndOrg(id, organizationId);

    values.push(id, organizationId);
    
    const query = `
      UPDATE clients 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND organization_id = $${queryIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE clients 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND organization_id = $2;
    `;
    await db.query(query, [id, organizationId]);
  }
}