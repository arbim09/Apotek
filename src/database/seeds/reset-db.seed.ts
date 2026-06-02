import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function reset() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'apotek_db',
    synchronize: false, // Matikan synchronize agar tidak terjadi konflik saat reset
    logging: true,
  });

  try {
    console.log('Connecting to database for reset...');
    await dataSource.initialize();
    
    console.log('Resetting database...');
    // Drop all tables in the public schema
    await dataSource.query('DROP SCHEMA public CASCADE');
    await dataSource.query('CREATE SCHEMA public');
    await dataSource.query('GRANT ALL ON SCHEMA public TO postgres');
    await dataSource.query('GRANT ALL ON SCHEMA public TO public');
    
    console.log('✅ Database reset successfully!');
  } catch (error: any) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

reset().catch((error: unknown) => {
  console.error('Reset error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});