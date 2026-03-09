import { db } from '@crm/database';
import { CreateTimeEntryDTO, UpdateTimeEntryDTO, TimeEntry } from '../types';

export class TimeEntryRepository {
  async create(organizationId: string, userId: string, data: CreateTimeEntryDTO): Promise<TimeEntry> {
    const query = `
      INSERT INTO time_entries (
        organization_id, project_id, task_id, user_id, 
        hours, description, billable
      )
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7::boolean, true))
      RETURNING *;
    `;
    const values = [
      organizationId,
      data.project_id,
      data.task_id || null,
      userId,
      data.hours,
      data.description || null,
      data.billable !== undefined ? data.billable : true
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string, projectId?: string, userId?: string): Promise<any[]> {
    let query = `
      SELECT 
        te.*, 
        p.name as project_name,
        t.title as task_title,
        u.name as user_name
      FROM time_entries te
      JOIN projects p ON te.project_id = p.id
      JOIN users u ON te.user_id = u.id
      LEFT JOIN tasks t ON te.task_id = t.id
      WHERE te.organization_id = $1
    `;
    
    const values: any[] = [organizationId];
    let queryIndex = 2;

    if (projectId) {
      query += ` AND te.project_id = $${queryIndex}`;
      values.push(projectId);
      queryIndex++;
    }

    if (userId) {
      query += ` AND te.user_id = $${queryIndex}`;
      values.push(userId);
      queryIndex++;
    }

    query += ` ORDER BY te.created_at DESC;`;

    const result = await db.query(query, values);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<TimeEntry | null> {
    const query = `
      SELECT * FROM time_entries 
      WHERE id = $1 AND organization_id = $2;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async update(id: string, organizationId: string, data: UpdateTimeEntryDTO): Promise<TimeEntry | null> {
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
      UPDATE time_entries 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND organization_id = $${queryIndex + 1}
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string, organizationId: string): Promise<void> {
    const query = `
      DELETE FROM time_entries 
      WHERE id = $1 AND organization_id = $2;
    `;
    await db.query(query, [id, organizationId]);
  }
}