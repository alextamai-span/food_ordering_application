import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterService } from '../services/registerService.ts';
import colors from 'console-log-colors'

// receive requests and respond to them
export const RegisterController = {
  // add a new account
  async register(request: FastifyRequest, reply: FastifyReply) {
    const service = RegisterService(request.server);
    
    try {
      const accountData = request.body as any;
      const newAccount = await service.registerAccount(accountData);

      // create JWT token with account id and email, expires in 15 minutes
      const token = request.server.jwt.sign(
        { 
          id: newAccount.data.id,
          email: newAccount.data.email
        },
        { expiresIn: '15m' }
      );
      
      return reply.status(201).send({
        message: 'Account created successful',
        accountId: newAccount.data.id,
        token: token,
        account_type: newAccount.data.account_type
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to create account' });
    }
  }
};