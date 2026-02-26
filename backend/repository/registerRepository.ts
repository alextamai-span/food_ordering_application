import { FastifyInstance } from 'fastify';
import { Account } from '../models/accountModel.ts';
import { newAccount } from '../db/registerQueries.ts';
import fastifyPostgres from '@fastify/postgres';

export const RegisterRepository = (fastify: FastifyInstance) => ({
  // create account
  async createAccount(
    name: string,
    email: string,
    passwordHash: string
  ): Promise<Account> {
    const client = await fastify.pg.connect();
    
    try {
      const { rows } = await client.query(
        newAccount,
        [name, email, passwordHash]
      );

      return rows[0];
    }
    finally {
      client.release();
    }
  }
});