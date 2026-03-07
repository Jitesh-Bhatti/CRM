import { db } from '@crm/database';
import { CreateLeadDTO, UpdateLeadDTO, Lead } from '../types';

export class LeadRepository {
  async create(organizationId: string, data: CreateLeadDTO): Promise<Lead> {
    const query = `
      INSERT INTO leads (
        organization_id, name, email, phone, company, 
        source, status, assigned_to, lead_score, notes
      )
      -- Notice the ::text and ::lead_status casting below to satisfy Postgres's strict typing
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7::text, 'new')::lead_status, $8, COALESCE($9, 0), $10)
      RETURNING *;
    `;
    const values = [
      organizationId,
      data.name,
      data.email || null,
      data.phone || null,
      data.company || null,
      data.source || null,
      data.status || null,
      data.assigned_to || null,
      data.lead_score || null,
      data.notes || null
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findAllByOrg(organizationId: string): Promise<Lead[]> {
    const query = `
      SELECT * FROM leads 
      WHERE organization_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
  }

  async findByIdAndOrg(id: string, organizationId: string): Promise<Lead | null> {
    const query = `
      SELECT * FROM leads 
      WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [id, organizationId]);
    return result.rows[0] || null;
  }

  // To check the unique_lead_email_company_per_org constraint
  async findByEmailAndCompany(organizationId: string, email: string, company: string): Promise<Lead | null> {
    const query = `
      SELECT * FROM leads 
      WHERE organization_id = $1 AND email = $2 AND company = $3 AND deleted_at IS NULL;
    `;
    const result = await db.query(query, [organizationId, email, company]);
    return result.rows[0] || null;
  }

  async update(id: string, organizationId: string, data: UpdateLeadDTO): Promise<Lead | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        // If we are updating the status, explicitly cast it to lead_status
        if (key === 'status') {
          updates.push(`${key} = $${queryIndex}::lead_status`);
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
      UPDATE leads 
      SET ${updates.join(', ')} 
      WHERE id = $${queryIndex} AND organization_id = $${queryIndex + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }

  async softDelete(id: string, organizationId: string): Promise<void> {
    const query = `
      UPDATE leads 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND organization_id = $2;
    `;
    await db.query(query, [id, organizationId]);
  }
}