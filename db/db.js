// ROJR/db/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Prefer a single DATABASE_URL (Render Postgres) and fall back to individual env vars.
// When connecting to hosted Postgres (Render) enable SSL to avoid cert errors.
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ROJ_db',
      password: process.env.DB_PASSWORD || '123456',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    };

const pool = new Pool(poolConfig);

pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

export default pool;
