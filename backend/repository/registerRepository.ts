import { FastifyInstance } from 'fastify';
import { Account } from '../models/accountModel.ts';
import { newAccount } from '../db/registerQueries.ts';
import fastifyPostgres from '@fastify/postgres';
import colors from 'console-log-colors';


export const RegisterRepository = (fastify: FastifyInstance) => ({
  // create account
  async createAccount(
    name: string,
    email: string,
    password: string,
    account_type: string
  ): Promise<Account> {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        newAccount,
        [name, email, password, account_type]
      );

      return rows[0];
    }
    finally {
      client.release();
    }
  }
});