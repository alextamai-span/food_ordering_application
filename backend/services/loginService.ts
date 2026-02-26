import { FastifyInstance } from 'fastify';
import { LoginRepository } from '../repository/loginRepository.ts';
import { hashPassword, comparePassword } from '../utils/authenticate';

export const LoginService = (fastify: FastifyInstance) => {
  const repo = LoginRepository(fastify);

  return {
    // account login
    async loginAccount(email: string, pass: string) {
      const account = await repo.findEmail(email);

      if (!account) {
        throw new Error('Invalid email or password');
      }

      // hash compare
      const isMatch = await comparePassword(pass, account.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      return { 
        id: account.id,
        email: account.email 
      };
    }
  };
};