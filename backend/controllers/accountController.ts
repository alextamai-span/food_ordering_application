import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountService } from '../services/accountService.ts';
import fastifyJwt from '@fastify/jwt';
import colors from 'console-log-colors'

// receive requests and respond to them
export const AccountController = {
  // delete account
  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const service = AccountService(request.server);

    try {
      const { id } = request.params as any;
      const account = await service.deleteAccount(id);

      return reply.send({
        success: true,
        message: 'Account Delete Successful',
        id: account.id,
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(401).send({
        success: false,
        message: 'Account Delete Failed'
      });
    }
  },

  // update account
  async updateAccount(request: FastifyRequest, reply: FastifyReply) {
    const service = AccountService(request.server);

    try {
      const { id } = request.params as any;
      const accountData = request.body as any;
      const account = await service.updateAccount(id, accountData);

      return reply.send({
        success: true,
        message: 'Account Update Successful',
        data: account,
      });
    }
    catch (err: any) {
      request.log.error(err);

      return reply.status(401).send({
        success: false,
        message: 'Account Update Failed'
      });
    }
  },

  // get employee data
  async getAccount(request: FastifyRequest, reply: FastifyReply) {
    const service = AccountService(request.server);

    try {
      const { empId } = request.params as { empId: number };

      if (!empId) {
        return reply.status(400).send({ message: 'empId is required' });
      }

      const user = await service.getEmployee(empId);

      return reply.status(200).send(user);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving Employee data' });
    }
  }
};