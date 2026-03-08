import app from './app';
import { env } from '@crm/config';
import { logger } from '@crm/utils/src/logger';
import { pool } from '@crm/database';

const startServer = async () => {
  try {
    // Verify database connection before starting the server
    await pool.query('SELECT 1');
    logger.info('✅ Database connected successfully');

    const port = env.PORT || 4000;
    
    app.listen(port, () => {
      logger.info(`🚀 API Server is running on http://localhost:${port}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();