import { Pool } from 'pg';
import { env } from '@crm/config';

// Create a single pool instance to be shared across the application
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Max number of connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper for executing queries
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  
  // Wrapper for database transactions
  transaction: async <T>(callback: (client: any) => Promise<T>): Promise<T> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};