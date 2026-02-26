import { FastifyRequest, FastifyReply } from 'fastify';
import { GuestMenuService } from '../services/guestMenuService.ts';
import { Account } from '../models/accountModel.ts';

// receive requests and respond to them
export const GuestMenuController = {
  // list Menu
  async listGuestMenu(request: FastifyRequest, reply: FastifyReply) {
    const service = GuestMenuService(request.server);

    try {
      const { account_type } = request.body as Pick<Account, 'account_type'>;
      const rows = await service.getGuestMenu(account_type);

      return reply.status(200).send(rows);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving Menu' });
    }
  }
};