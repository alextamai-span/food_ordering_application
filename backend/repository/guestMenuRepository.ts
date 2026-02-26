import { FastifyInstance } from 'fastify';
import { Menu } from '../models/MenuModel.ts';
import fastifyPostgres from '@fastify/postgres';
import { listGuestMenuQuery } from '../db/menuQueries.ts';
import { Account } from '../models/accountModel.ts';

export const GuestMenuRepository = (fastify: FastifyInstance) => ({
  // listing all Menu
  async listGuestMenu(account_type: string): Promise<Menu[]> {
    try {
      const { rows } = await fastify.pg.query(
        listGuestMenuQuery,
        [account_type]
      );
      
      return rows;
    }
    catch (error) {
      console.error('Failed to list Menu in the DB', error);
      throw new Error('Failed to list Menu in DB');
    }
  }
});