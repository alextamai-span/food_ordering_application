import { FastifyInstance } from 'fastify';
import { RegisterRepository } from '../repository/registerRepository.ts';
import { hashPassword, comparePassword } from '../utils/authenticate';
import { LoginRepository } from '../repository/loginRepository.ts';

export const RegisterService = (fastify: FastifyInstance) => {
  const repoReg = RegisterRepository(fastify);
  const repoValidate = LoginRepository(fastify);

  return {
    // create a new account
    async registerAccount(payload: any) {
      // check if email already exists
      const existing = await repoValidate.findEmail(payload.email);

      if (existing) {       
        return {
          success: false,
          message: 'User already exists'
        };
      }

      // hash password
      const hashed = await hashPassword(payload.password);
      
      return {
        success: true,
        data: await repoReg.createAccount(
          payload.name, payload.email, hashed, payload.account_type
        )
      };
    }
  };
};