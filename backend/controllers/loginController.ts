import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginService } from '../services/loginService.ts';

// receive requests and respond to them
export const LoginController = {
  // login
  async login(request: FastifyRequest, reply: FastifyReply) {
    const service = LoginService(request.server);

    try {
      const { accountEmail, accountPassword } = request.body as any;
      const account = await service.loginAccount(accountEmail, accountPassword);

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
        accountId: account.id,
        token: token,
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(401).send({ message: 'Login failed' });
    }
  }
};