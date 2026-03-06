import { FastifyRequest, FastifyReply } from 'fastify';
import { GuestMenuService } from '../services/guestMenuService.ts';
import colors from 'console-log-colors'

// receive requests and respond to them
export const GuestMenuController = {
  // list Menu
  async listGuestMenu(request: FastifyRequest, reply: FastifyReply) {
    const service = GuestMenuService(request.server);

    try {
      const rows = await service.getGuestMenu();
      return reply.status(200).send(rows);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving Menu' });
    }
  }
};