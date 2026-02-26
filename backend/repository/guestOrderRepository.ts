import { FastifyInstance } from 'fastify';
import { Order } from '../models/orderModel.ts';
import fastifyPostgres from '@fastify/postgres';
import { addOrderQueryGuest, orderListQueryGuest } from '../db/orderQueries.ts';

export const GuestOrderRepository = (fastify: FastifyInstance) => ({
  // add a new order
  async createOrder(data: Omit<Order, "id" | "created_at" | "completed_at">): Promise<Order> {
    try {
      const { rows } = await fastify.pg.query(
        addOrderQueryGuest,
        [
          data.guest_id,
          data.total_price,
          data.order_status
        ]
      );
      return rows[0];
    }
    catch(error) {
      console.error('Failed to add order to the DB');
      throw new Error('Failed to add order to DB');
    }
  },

  // listing all orders
  async listAllOrders(guest_id: number): Promise<Order[]> {
    try {
      const { rows } = await fastify.pg.query(
        orderListQueryGuest,
        [ guest_id ]
      );
      
      return rows;
    }
    catch (error) {
      console.error('Failed to list orders in the DB', error);
      throw new Error('Failed to list orders in DB');
    }
  }
});