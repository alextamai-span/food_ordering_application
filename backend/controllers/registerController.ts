import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterService } from '../services/registerService.ts';
import fastifyJwt from '@fastify/jwt';
import colors from 'console-log-colors'

// receive requests and respond to them
export const RegisterController = {
  // add a new account
  async register(request: FastifyRequest, reply: FastifyReply) {
    const service = RegisterService(request.server);
    
    try {
      const accountData = request.body as any;
      const newAccount = await service.registerAccount(accountData);

      console.log(colors.red('new account'), newAccount)

      // Check if registration failed
      if (!newAccount.success || !newAccount.data) {
        return reply.status(409).send({ message: newAccount.message });
      }

      // create JWT token with account id and email, expires in 15 minutes
      const token = request.server.jwt.sign(
        { 
          id: newAccount.data.id,
          email: newAccount.data.email
        },
        { expiresIn: '1hr' }
      );
      
      return reply.status(201).send({
        message: 'Account created successful',
        id: newAccount.data.id,
        accountId: newAccount.data.id,
        token: token,
        account_type: newAccount.data.account_type
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(400).send({ message: 'Failed to create account' });
    }
  }
};