import { db } from '@crm/database';
import { RegisterOrganizationDTO } from '../types';
import crypto from 'crypto';

export class AuthRepository {
  async createTenantWithOwner(data: RegisterOrganizationDTO & { passwordHash: string }) {
    // 1 & 2. Generate IDs in Application
    const organizationId = crypto.randomUUID();
    const ownerUserId = crypto.randomUUID();

    // 3. Begin Transaction
    return await db.transaction(async (client) => {
      
      // 4. Insert Organization (Constraint is deferred, so this succeeds)
      await client.query(
        `INSERT INTO organizations (id, name, owner_user_id) 
         VALUES ($1, $2, $3)`,
        [organizationId, data.organization_name, ownerUserId]
      );

      // 5. Insert Owner User
      const userResult = await client.query(
        `INSERT INTO users (id, organization_id, name, email, status, is_org_owner) 
         VALUES ($1, $2, $3, $4, 'active', true) 
         RETURNING id, name, email, organization_id`,
        [ownerUserId, organizationId, data.owner_name, data.owner_email]
      );

      // 6. Insert Credentials
      await client.query(
        `INSERT INTO user_credentials (user_id, password_hash) 
         VALUES ($1, $2)`,
        [ownerUserId, data.passwordHash]
      );

      // 7. Insert Organization Settings
      await client.query(
        `INSERT INTO organization_settings (organization_id) VALUES ($1)`,
        [organizationId]
      );

      // 8. Commit Transaction happens automatically when this callback returns
      return userResult.rows[0];
    });
  }

  async findUserByEmail(email: string) {
    const result = await db.query(
      `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );
    return result.rows[0] || null;
  }

  async findUserWithCredentialsByEmail(email: string) {
    const query = `
      SELECT u.id, u.organization_id, u.name, u.email, u.status, uc.password_hash
      FROM users u
      JOIN user_credentials uc ON u.id = uc.user_id
      WHERE u.email = $1 AND u.deleted_at IS NULL
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }
}