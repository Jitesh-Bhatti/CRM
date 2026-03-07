import { db } from '@crm/database';
import { CreateClientContactDTO, UpdateClientContactDTO, ClientContact } from '../types';

export class ClientContactRepository {
  async create(clientId: string, data: CreateClientContactDTO): Promise<ClientContact> {
    const query = `
      INSERT INTO client_contacts (
        client_id, name, email, phone, designation, is_primary
      )
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, false))
      RETURNING *;
    `;
    const values = [
      clientId,
      data.name,
      data.email || null,
      data.phone || null,
      data.designation || null,
      data.is_primary || null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByClient(clientId: string): Promise<ClientContact[]> {
    const query = `
      SELECT * FROM client_contacts 
      WHERE client_id = $1 AND deleted_at IS NULL
      ORDER BY is_primary DESC, created_at ASC;
    `;
    const result = await db.query(query, [clientId]);
    return result.rows;
  }

  async findByIdAndClient(id: string, clientId: string): Promise<ClientContact | null> {
    const query = `
      SELECT * FROM client_contacts 
      WHERE id = $1 AND client_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, clientId]);
    return result.rows[0] || null;
  }

  async update(id: string, clientId: string, data: UpdateClientContactDTO): Promise<ClientContact | null> {
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

    if (updates.length === 0) return this.findByIdAndClient(id, clientId);

    values.push(id, clientId);
    
    const query = `
      UPDATE client_contacts 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND client_id = $${queryIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string, clientId: string): Promise<void> {
    const query = `
      UPDATE client_contacts 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND client_id = $2;
    `;
    await db.query(query, [id, clientId]);
  }
}