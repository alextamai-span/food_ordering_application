import { FastifyInstance } from 'fastify';
import { Account } from '../models/accountModel.ts';
import { accountLogin } from '../db/loginQueries.ts';
import fastifyPostgres from '@fastify/postgres';

export const LoginRepository = (fastify: FastifyInstance) => ({
  // Find account by email (for login)
  async findEmail(email: string): Promise<Account | null> {
    const { rows } = await fastify.pg.query(
      accountLogin,
      [email]
    );

    return rows[0] || null;
  }
});