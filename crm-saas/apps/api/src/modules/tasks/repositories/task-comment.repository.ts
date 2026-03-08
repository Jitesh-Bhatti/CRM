import { db } from '@crm/database';
import { CreateTaskCommentDTO, UpdateTaskCommentDTO, TaskComment } from '../types';

export class TaskCommentRepository {
  async create(taskId: string, userId: string, data: CreateTaskCommentDTO): Promise<TaskComment> {
    const query = `
      INSERT INTO task_comments (task_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [taskId, userId, data.comment_text];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByTask(taskId: string): Promise<TaskComment[]> {
    const query = `
      SELECT 
        tc.*, 
        u.name as user_name,
        u.avatar_url as user_avatar
      FROM task_comments tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.task_id = $1
      ORDER BY tc.created_at ASC;
    `;
    const result = await db.query(query, [taskId]);
    return result.rows;
  }

  async findByIdAndTask(id: string, taskId: string): Promise<TaskComment | null> {
    const query = `
      SELECT * FROM task_comments 
      WHERE id = $1 AND task_id = $2;
    `;
    const result = await db.query(query, [id, taskId]);
    return result.rows[0] || null;
  }

  async update(id: string, taskId: string, data: UpdateTaskCommentDTO): Promise<TaskComment | null> {
    const query = `
      UPDATE task_comments 
      SET comment_text = $1 
      WHERE id = $2 AND task_id = $3
      RETURNING *;
    `;
    const result = await db.query(query, [data.comment_text, id, taskId]);
    return result.rows[0] || null;
  }

  async delete(id: string, taskId: string): Promise<void> {
    const query = `
      DELETE FROM task_comments 
      WHERE id = $1 AND task_id = $2;
    `;
    await db.query(query, [id, taskId]);
  }
}