import { db } from '@crm/database';
import { CreateChangeRequestDTO, UpdateChangeRequestDTO, ChangeRequest } from '../types';

export class ChangeRequestRepository {
  async create(projectId: string, userId: string, data: CreateChangeRequestDTO): Promise<ChangeRequest> {
    const query = `
      INSERT INTO change_requests (project_id, requested_by, description, status)
      VALUES ($1, $2, $3, 'pending'::change_request_status)
      RETURNING *;
    `;
    const values = [projectId, userId, data.description];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByProject(projectId: string): Promise<ChangeRequest[]> {
    const query = `
      SELECT 
        cr.*, 
        req_user.name as requested_by_name,
        app_user.name as approved_by_name
      FROM change_requests cr
      JOIN users req_user ON cr.requested_by = req_user.id
      LEFT JOIN users app_user ON cr.approved_by = app_user.id
      WHERE cr.project_id = $1
      ORDER BY cr.created_at DESC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
  }

  async findByIdAndProject(id: string, projectId: string): Promise<ChangeRequest | null> {
    const query = `
      SELECT * FROM change_requests 
      WHERE id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [id, projectId]);
    return result.rows[0] || null;
  }

  async update(id: string, projectId: string, data: UpdateChangeRequestDTO & { approved_by?: string | null }): Promise<ChangeRequest | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'status') {
          updates.push(`${key} = $${queryIndex}::change_request_status`);
        } else {
          updates.push(`${key} = $${queryIndex}`);
        }
        values.push(value);
        queryIndex++;
      }
    });

    if (updates.length === 0) return this.findByIdAndProject(id, projectId);

    values.push(id, projectId);
    
    const query = `
      UPDATE change_requests 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND project_id = $${queryIndex + 1}
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string, projectId: string): Promise<void> {
    const query = `
      DELETE FROM change_requests 
      WHERE id = $1 AND project_id = $2;
    `;
    await db.query(query, [id, projectId]);
  }
}