import { FastifyInstance } from 'fastify';
import { GuestMenuRepository } from '../repository/guestMenuRepository.ts';
import { Menu } from '../models/MenuModel.ts';
import { Account } from '../models/accountModel.ts';

export const GuestMenuService = (fastify: FastifyInstance) => {
  const repo = GuestMenuRepository(fastify);

  return {
    // listing all Menu
    async getGuestMenu(account_type: string): Promise<Menu[]> {
      return await repo.listGuestMenu(account_type);
    }
  };
};