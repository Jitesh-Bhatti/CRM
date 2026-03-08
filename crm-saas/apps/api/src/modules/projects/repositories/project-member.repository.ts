import { db } from '@crm/database';
import { CreateProjectMemberDTO, UpdateProjectMemberDTO, ProjectMember } from '../types';

export class ProjectMemberRepository {
  async create(projectId: string, data: CreateProjectMemberDTO): Promise<ProjectMember> {
    const query = `
      INSERT INTO project_members (project_id, user_id, role_in_project)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [projectId, data.user_id, data.role_in_project || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByProject(projectId: string): Promise<ProjectMember[]> {
    const query = `
      SELECT pm.*, u.name as user_name, u.email as user_email
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
      ORDER BY pm.assigned_at ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
  }

  async findByIdAndProject(id: string, projectId: string): Promise<ProjectMember | null> {
    const query = `
      SELECT * FROM project_members 
      WHERE id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [id, projectId]);
    return result.rows[0] || null;
  }

  // Used to prevent adding the same user twice
  async findByUserAndProject(userId: string, projectId: string): Promise<ProjectMember | null> {
    const query = `
      SELECT * FROM project_members 
      WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0] || null;
  }

  async update(id: string, projectId: string, data: UpdateProjectMemberDTO): Promise<ProjectMember | null> {
    const query = `
      UPDATE project_members 
      SET role_in_project = $1 
      WHERE id = $2 AND project_id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [data.role_in_project, id, projectId]);
    return result.rows[0] || null;
  }

  async delete(id: string, projectId: string): Promise<void> {
    const query = `
      DELETE FROM project_members 
      WHERE id = $1 AND project_id = $2;
    `;
    await db.query(query, [id, projectId]);
  }
}