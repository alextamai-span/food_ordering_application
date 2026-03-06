import { FastifyInstance } from 'fastify';
import { Order } from '../models/orderModel.ts';
import fastifyPostgres from '@fastify/postgres';
import { addOrderQueryGuest, orderListQueryGuest } from '../db/orderQueries.ts';
import colors from 'console-log-colors'

export const GuestOrderRepository = (fastify: FastifyInstance) => ({
  // add a new order
  async createOrder(data: { user_id: number; total_price: number; order_status: string }): Promise<Order> {
    try {
      const { rows } = await fastify.pg.query(
        addOrderQueryGuest,
        [
          data.user_id,
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
  async listAllOrders(user_id: number): Promise<Order[]> {
    try {
      const { rows } = await fastify.pg.query(
        orderListQueryGuest,
        [ user_id ]
      );
      
      return rows;
    }
    catch (error) {
      console.error('Failed to list orders in the DB', error);
      throw new Error('Failed to list orders in DB');
    }
  }
});