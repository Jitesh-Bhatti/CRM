import { db } from '@crm/database';
import { CreateProjectRequirementDTO, UpdateProjectRequirementDTO, ProjectRequirement } from '../types';

export class RequirementRepository {
  async create(projectId: string, userId: string, data: CreateProjectRequirementDTO): Promise<ProjectRequirement> {
    const query = `
      INSERT INTO project_requirements (project_id, requirement_text, created_by)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [projectId, data.requirement_text, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByProject(projectId: string): Promise<ProjectRequirement[]> {
    const query = `
      SELECT pr.*, u.name as created_by_name
      FROM project_requirements pr
      JOIN users u ON pr.created_by = u.id
      WHERE pr.project_id = $1
      ORDER BY pr.created_at ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
  }

  async findByIdAndProject(id: string, projectId: string): Promise<ProjectRequirement | null> {
    const query = `
      SELECT * FROM project_requirements 
      WHERE id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [id, projectId]);
    return result.rows[0] || null;
  }

  async update(id: string, projectId: string, data: UpdateProjectRequirementDTO): Promise<ProjectRequirement | null> {
    const query = `
      UPDATE project_requirements 
      SET requirement_text = $1 
      WHERE id = $2 AND project_id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [data.requirement_text, id, projectId]);
    return result.rows[0] || null;
  }

  async delete(id: string, projectId: string): Promise<void> {
    const query = `
      DELETE FROM project_requirements 
      WHERE id = $1 AND project_id = $2;
    `;
    await db.query(query, [id, projectId]);
  }
}