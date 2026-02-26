import { FastifyRequest, FastifyReply } from 'fastify';
import { GuestOrderService } from '../services/guestOrderService.ts';
import { Order } from '../models/orderModel.ts';

// receive requests and respond to them
export const GuestOrderController = {
  // add an order
  async addOrder(request: FastifyRequest, reply: FastifyReply) {
    const service = GuestOrderService(request.server);

    try {
      const orderData = request.body as Omit<Order, 'id' | 'created_at' | 'completed_at'>;
      const newOrder = await service.registerOrder(orderData);

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
      const guest_id = (request.body as any).guest_id as number;
      const rows = await service.getAllOrders(guest_id);
      return reply.status(200).send(rows);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving orders' });
    }
  }
};