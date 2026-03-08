import { db } from '@crm/database';
import { CreateProjectDTO, UpdateProjectDTO, Project } from '../types';

export class ProjectRepository {
  async create(organizationId: string, userId: string, data: CreateProjectDTO): Promise<Project> {
    const query = `
      INSERT INTO projects (
        organization_id, client_id, name, project_type, description, 
        start_date, end_date, status, budget, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8::text, 'planning')::project_status, $9, $10)
      RETURNING *;
    `;
    const values = [
      organizationId,
      data.client_id,
      data.name,
      data.project_type || null,
      data.description || null,
      data.start_date || null,
      data.end_date || null,
      data.status || null,
      data.budget || null,
      userId
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string): Promise<Project[]> {
    const query = `
      SELECT * FROM projects 
      WHERE organization_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<Project | null> {
    const query = `
      SELECT * FROM projects 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async update(id: string, organizationId: string, data: UpdateProjectDTO): Promise<Project | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'status') {
          updates.push(`${key} = $${queryIndex}::project_status`);
        } else {
          updates.push(`${key} = $${queryIndex}`);
        }
        values.push(value);
        queryIndex++;
      }
    });

    if (updates.length === 0) return this.findByIdAndOrg(id, organizationId);

    values.push(id, organizationId);
    
    const query = `
      UPDATE projects 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND organization_id = $${queryIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE projects 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND organization_id = $2;
    `;
    await db.query(query, [id, organizationId]);
  }
}