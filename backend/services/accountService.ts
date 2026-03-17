import { FastifyInstance } from 'fastify';
import { AccountRepository } from '../repository/accountRepository.ts';
import { Account } from '../models/accountModel.ts';

export const AccountService = (fastify: FastifyInstance) => {
  const repo = AccountRepository(fastify);

  return {
    // delete account
    async deleteAccount(id: number) {
      const account = await repo.deleteAccount(id);

      if (!account) {
        throw new Error('Invalid id');
      }

      return account;
    },

    // update account
    async updateAccount(id: number, accountData: Partial<Account>) {
      const account = await repo.updateAccount(id, accountData);
      
      if (!account) {
        throw new Error('Invalid id or account data');
      }

      return account;
    },

    // get employee data
    async getEmployee(empId: number) {
      const data = await repo.getEmployee(empId);

      if (!data.length) {
        throw new Error('Employee not found');
      }

      return data;
    }
  };
};