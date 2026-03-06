import { FastifyInstance } from 'fastify';
import { GuestOrderRepository } from '../repository/guestOrderRepository.ts';
import { Order } from '../models/orderModel.ts';

export const GuestOrderService = (fastify: FastifyInstance) => {
  const repo = GuestOrderRepository(fastify);

  return {
    // create a new order
    async registerOrder(user_id: number, total_price: number, order_status: string): Promise<Order> {
      return repo.createOrder({ user_id, total_price, order_status });
    },

    // listing all orders
    async getAllOrders(user_id: number): Promise<Order[]> {
      return await repo.listAllOrders(user_id);
    }
  };
};