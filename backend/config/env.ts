import dotenv from 'dotenv';

// environmental variables

dotenv.config();

export const env = {
  PORT: 5000,
  DATABASE_URL: 'postgres://postgres:Wrestling22!@localhost:4194/food_ordering',
  JWT_SECRET: 'alex-span-secret-key',
  FRONTEND_URL: 'http://localhost:5173',
};
