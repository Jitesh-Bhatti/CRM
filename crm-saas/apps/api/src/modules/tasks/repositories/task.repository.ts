import { db } from '@crm/database';
import { CreateTaskDTO, UpdateTaskDTO, Task } from '../types';

export class TaskRepository {
  async create(organizationId: string, userId: string, data: CreateTaskDTO): Promise<Task> {
    const query = `
      INSERT INTO tasks (
        organization_id, project_id, title, description, assigned_to, 
        priority, status, deadline, created_by
      )
      VALUES (
        $1, $2, $3, $4, $5, 
        COALESCE($6::text, 'medium')::task_priority, 
        COALESCE($7::text, 'todo')::task_status, 
        $8, $9
      )
      RETURNING *;
    `;
    const values = [
      organizationId,
      data.project_id,
      data.title,
      data.description || null,
      data.assigned_to || null,
      data.priority || null,
      data.status || null,
      data.deadline || null,
      userId
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string, projectId?: string): Promise<Task[]> {
    let query = `
      SELECT 
        t.*, 
        p.name as project_name,
        u.name as assignee_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.organization_id = $1 AND t.deleted_at IS NULL
    `;
    
    const values: any[] = [organizationId];

    if (projectId) {
      query += ` AND t.project_id = $2`;
      values.push(projectId);
    }

    query += ` ORDER BY t.created_at DESC;`;

    const result = await db.query(query, values);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<Task | null> {
    const query = `
      SELECT * FROM tasks 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async update(id: string, organizationId: string, data: UpdateTaskDTO): Promise<Task | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'priority') {
          updates.push(`${key} = $${queryIndex}::task_priority`);
        } else if (key === 'status') {
          updates.push(`${key} = $${queryIndex}::task_status`);
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
      UPDATE tasks 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND organization_id = $${queryIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE tasks 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND organization_id = $2;
    `;
    await db.query(query, [id, organizationId]);
  }
}