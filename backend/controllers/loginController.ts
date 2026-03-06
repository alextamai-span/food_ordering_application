import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginService } from '../services/loginService.ts';
import fastifyJwt from '@fastify/jwt';
import colors from 'console-log-colors'

// receive requests and respond to them
export const LoginController = {
  // login
  async login(request: FastifyRequest, reply: FastifyReply) {
    const service = LoginService(request.server);

    try {
      const { email, password } = request.body as any;
      const account = await service.loginAccount(email, password);

      // create JWT token with account id and email, expires in 15 minutes
      const token = request.server.jwt.sign(
        { 
          id: account.id,
          email: account.email
        },
        { expiresIn: '15m' }
      );

      // send the token and account id back to the client (frontend - services/account.service)
      return reply.send({
        message: 'Login successful',
        id: account.id,
        accountId: account.id,
        token: token,
        account_type: account.account_type
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(401).send({ message: 'Login failed' });
    }
  }
};