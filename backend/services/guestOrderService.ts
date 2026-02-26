import { FastifyInstance } from 'fastify';
import { GuestOrderRepository } from '../repository/guestOrderRepository.ts';
import { Order } from '../models/orderModel.ts';

export const GuestOrderService = (fastify: FastifyInstance) => {
  const repo = GuestOrderRepository(fastify);

  return {
    // create a new order
    async registerOrder(orderData: Omit<Order, 'id' | 'created_at' | 'completed_at'>): Promise<Order> {
      return repo.createOrder(orderData);
    },

    // listing all orders
    async getAllOrders(guest_id: number): Promise<Order[]> {
      return await repo.listAllOrders(guest_id);
    }
  };
};