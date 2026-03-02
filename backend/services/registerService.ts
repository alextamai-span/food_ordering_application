import { FastifyInstance } from 'fastify';
import { RegisterRepository } from '../repository/registerRepository.ts';
import { hashPassword, comparePassword } from '../utils/authenticate';

export const RegisterService = (fastify: FastifyInstance) => {
  const repo = RegisterRepository(fastify);

  return {
    // create a new account
    async registerAccount(payload: any) {
      // hash password
      const hashed = await hashPassword(payload.password);
      
      return {
        success: true,
        data: await repo.createAccount(
          payload.name, payload.email, hashed, payload.account_type
        )
      };
    }
  };
};