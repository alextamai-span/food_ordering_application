import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterService } from '../services/registerService.ts';

// receive requests and respond to them
export const RegisterController = {
  // add a new account
  async register(request: FastifyRequest, reply: FastifyReply) {
    const service = RegisterService(request.server);
    
    try {
      const accountData = request.body as any;
      const newAccount = await service.registerAccount(accountData);

      return reply.status(201).send({
        message: 'Account created successfully!',
        data: newAccount
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to create account' });
    }
  }
};