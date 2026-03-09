import { db } from '@crm/database';
import { CreateFileDTO, File } from '../types';

export class FileRepository {
  async create(organizationId: string, userId: string, data: CreateFileDTO): Promise<File> {
    const query = `
      INSERT INTO files (
        organization_id, file_name, file_url, file_type, file_size, 
        uploaded_by, entity_type, entity_id, storage_provider
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 
        $7::file_entity_type, $8, 
        COALESCE($9::text, 'local')::storage_provider_type
      )
      RETURNING *;
    `;
    const values = [
      organizationId,
      data.file_name,
      data.file_url,
      data.file_type || null,
      data.file_size || null,
      userId,
      data.entity_type || null,
      data.entity_id || null,
      data.storage_provider || 'local'
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string, entityType?: string, entityId?: string): Promise<File[]> {
    let query = `
      SELECT * FROM files 
      WHERE organization_id = $1 AND deleted_at IS NULL
    `;
    const values: any[] = [organizationId];

    if (entityType && entityId) {
      query += ` AND entity_type = $2::file_entity_type AND entity_id = $3`;
      values.push(entityType, entityId);
    }

    query += ` ORDER BY created_at DESC;`;

    const result = await db.query(query, values);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<File | null> {
    const query = `
      SELECT * FROM files 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE files 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND organization_id = $2;
    `;
    await db.query(query, [id, organizationId]);
  }
}