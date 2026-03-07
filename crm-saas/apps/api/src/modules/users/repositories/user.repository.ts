import { db } from '@crm/database';
import { CreateUserDTO, UpdateUserDTO, User } from '../types';

export class UserRepository {
  async create(organizationId: string, data: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO users (organization_id, name, email, phone, timezone, status)
      VALUES ($1, $2, $3, $4, $5, 'invited')
      RETURNING *;
    `;
    const values = [organizationId, data.name, data.email, data.phone || null, data.timezone || 'UTC'];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string): Promise<User[]> {
    const query = `
      SELECT id, organization_id, name, email, phone, avatar_url, status, timezone, is_org_owner, last_login_at, created_at 
      FROM users 
      WHERE organization_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async findByEmailAndOrg(email: string, organizationId: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE email = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [email, organizationId]);
    return result.rows[0] || null;
  }

  async update(id: string, organizationId: string, data: UpdateUserDTO): Promise<User | null> {
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

    // Add ID and OrgID to the end of the values array for the WHERE clause
    values.push(id, organizationId);
    
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND organization_id = $${queryIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE users 
      SET deleted_at = CURRENT_TIMESTAMP, status = 'suspended'
      WHERE id = $1 AND organization_id = $2 AND is_org_owner = false;
    `;
    await db.query(query, [id, organizationId]);
  }
}