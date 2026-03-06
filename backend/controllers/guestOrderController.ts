import { FastifyRequest, FastifyReply } from 'fastify';
import { GuestOrderService } from '../services/guestOrderService.ts';
import { Order } from '../models/orderModel.ts';
import colors from 'console-log-colors'

// receive requests and respond to them
export const GuestOrderController = {
  // add an order
  async addOrder(request: FastifyRequest, reply: FastifyReply) {
    const service = GuestOrderService(request.server);

    try {
      const id = request.params as { userId: number };
      const { total_price, order_status } = request.body as { total_price: number; order_status: string };

      const newOrder = await service.registerOrder(id.userId, total_price, order_status);

      return reply.status(201).send({
        message: 'Order created successfully!',
        data: newOrder
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to create order' });
    }
  },

  // list orders
  async listOrders(request: FastifyRequest, reply: FastifyReply) {
    const service = GuestOrderService(request.server);

    try {
      const id = request.params as { userId: number };
      const rows = await service.getAllOrders(id.userId);

      return reply.status(200).send(rows);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving orders' });
    }
  }
};