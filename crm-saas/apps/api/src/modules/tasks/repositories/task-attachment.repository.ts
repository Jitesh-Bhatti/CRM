import { db } from '@crm/database';
import { CreateTaskAttachmentDTO, TaskAttachment } from '../types';

export class TaskAttachmentRepository {
  async attach(taskId: string, data: CreateTaskAttachmentDTO): Promise<TaskAttachment> {
    const query = `
      INSERT INTO task_attachments (task_id, file_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await db.query(query, [taskId, data.file_id]);
    return result.rows[0];
  }

  async findAllByTask(taskId: string): Promise<any[]> {
    const query = `
      SELECT 
        ta.id as attachment_id,
        ta.task_id,
        f.id as file_id,
        f.file_name,
        f.file_url,
        f.file_type,
        f.file_size,
        f.uploaded_by
      FROM task_attachments ta
      JOIN files f ON ta.file_id = f.id
      WHERE ta.task_id = $1 AND f.deleted_at IS NULL;
    `;
    const result = await db.query(query, [taskId]);
    return result.rows;
  }

  async findByIdAndTask(id: string, taskId: string): Promise<TaskAttachment | null> {
    const query = `
      SELECT * FROM task_attachments 
      WHERE id = $1 AND task_id = $2;
    `;
    const result = await db.query(query, [id, taskId]);
    return result.rows[0] || null;
  }

  async detach(id: string, taskId: string): Promise<void> {
    const query = `
      DELETE FROM task_attachments 
      WHERE id = $1 AND task_id = $2;
    `;
    await db.query(query, [id, taskId]);
  }
}