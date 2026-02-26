import { FastifyInstance } from 'fastify';
import { EmpOrderRepository } from '../repository/empOrderRepository.ts';
import { Order } from '../models/orderModel.ts';

export const EmpOrderService = (fastify: FastifyInstance) => {
  const repo = EmpOrderRepository(fastify);

  return {
    // update order
    async updateOrderEmp(orderId: number, orderData: Order): Promise<Order> {
      return await repo.updateOrderEmp(orderId, orderData);
    },

    // delete order
    async deleteOrderEmp(orderId: number): Promise<boolean> {
      return repo.deleteOrderEmp(orderId);
    },

    // listing all orders
    async getAllOrdersEmp(): Promise<Order[]> {
      return await repo.listAllOrdersEmp();
    }
  };
};