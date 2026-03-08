import { db } from '@crm/database';
import { CreateMilestoneDTO, UpdateMilestoneDTO, Milestone } from '../types';

export class MilestoneRepository {
  async create(projectId: string, data: CreateMilestoneDTO): Promise<Milestone> {
    const query = `
      INSERT INTO milestones (
        project_id, title, description, deadline, status, approval_status
      )
      VALUES (
        $1, $2, $3, $4, 
        COALESCE($5::text, 'pending')::milestone_status, 
        COALESCE($6::text, 'pending')::approval_status
      )
      RETURNING *;
    `;
    const values = [
      projectId,
      data.title,
      data.description || null,
      data.deadline || null,
      data.status || null,
      data.approval_status || null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByProject(projectId: string): Promise<Milestone[]> {
    const query = `
      SELECT * FROM milestones 
      WHERE project_id = $1
      ORDER BY deadline ASC NULLS LAST, created_at ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
  }

  async findByIdAndProject(id: string, projectId: string): Promise<Milestone | null> {
    const query = `
      SELECT * FROM milestones 
      WHERE id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [id, projectId]);
    return result.rows[0] || null;
  }

  async update(id: string, projectId: string, data: UpdateMilestoneDTO): Promise<Milestone | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'status') {
          updates.push(`${key} = $${queryIndex}::milestone_status`);
        } else if (key === 'approval_status') {
          updates.push(`${key} = $${queryIndex}::approval_status`);
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
      UPDATE milestones 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND project_id = $${queryIndex + 1}
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string, projectId: string): Promise<void> {
    const query = `
      DELETE FROM milestones 
      WHERE id = $1 AND project_id = $2;
    `;
    await db.query(query, [id, projectId]);
  }
}