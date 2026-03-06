import { FastifyRequest, FastifyReply } from 'fastify';
import { EmpOrderService } from '../services/empOrderService.ts';
import { Order } from '../models/orderModel.ts';
import colors from 'console-log-colors'

// receive requests and respond to them
export const EmpOrderController = {
  // create order
  async createOrderEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpOrderService(request.server);
    try {
      const orderData = request.body as Order;
      const createdOrder = await service.createOrderEmp(orderData);
      return reply.status(201).send({
        message: 'Order created successfully!',
        data: createdOrder
      });
    }
    catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ message: 'Failed to create order' });
    }
  },

  // update order
  async updateOrderEmp(request: FastifyRequest, reply: FastifyReply) {
    const service = EmpOrderService(request.server);

    try {
      const { id } = request.params as { id: number };
      const orderData = request.body as Order;
      const updatedOrder = await service.updateOrderEmp(id, orderData);

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
      const { id } = request.params as { id: number };
      const deleted = await service.deleteOrderEmp(id);

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