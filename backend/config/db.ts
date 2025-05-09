import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Try with direct hardcoded values for testing
const sequelize = new Sequelize('postgres', 'postgres', '220504', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
