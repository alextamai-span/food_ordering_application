import { FastifyRequest, FastifyReply } from 'fastify';
import { EmpOrderService } from '../services/empOrderService.ts';
import { Order } from '../models/orderModel.ts';

// receive requests and respond to them
export const EmpOrderController = {
  // update order
  async updateOrderEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpOrderService(request.server);

    try {
      const { orderId } = request.query as { orderId: any};
      const orderData = request.body as Order;

      const updatedOrder = await service.updateOrderEmp(orderId, orderData);

      return reply.status(200).send({
        message: 'Order updated successfully!',
        data: updatedOrder
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to update order' });
    }
  },

  // list orders
  async listOrdersEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpOrderService(request.server);

    try {
      const rows = await service.getAllOrdersEmp();
      return reply.status(200).send(rows);
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Error retrieving orders' });
    }
  },

  // delete order
  async deleteOrderEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpOrderService(request.server);
  
    try {
      const { orderId } = request.query as { orderId?: any };
      const deleted = await service.deleteOrderEmp(orderId);

      if (!deleted) {
        return reply.status(404).send({ message: 'Order not found' });
      }

      return reply.status(200).send({
        message: 'Order deleted successfully!',
        deleted
      });
    } 
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to delete order' });
    }
  }

};