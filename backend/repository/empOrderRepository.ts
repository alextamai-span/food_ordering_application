import { FastifyInstance } from 'fastify';
import { Order } from '../models/orderModel.ts';
import fastifyPostgres from '@fastify/postgres';
import { createOrderQueryEmp, updateOrderQueryEmp, deleteOrderQueryEmp, orderListQueryEmp } from '../db/orderQueries.ts';
import colors from 'console-log-colors'

export const EmpOrderRepository = (fastify: FastifyInstance) => ({
  // create order
  async createOrderEmp(orderData: Order): Promise<Order> {
    try {
      const { rows } = await fastify.pg.query(
        createOrderQueryEmp,
        [orderData.user_id, orderData.order_status, orderData.total_price]
      );
      return rows[0];
    }
    catch (error) {
      console.error('Failed to create order in the DB', error);
      throw new Error('Failed to create order in DB');
    }
  },

  // update order
  async updateOrderEmp(orderId: number, orderData: Order): Promise<Order> {
    try {
      const { rows } = await fastify.pg.query(
        updateOrderQueryEmp,
        [
          orderId,
          orderData.order_status,
          orderData.completed_at
        ]
      );
      return rows[0];
    }
    catch (error) {
      console.error('Failed to update order in the DB', error);
      throw new Error('Failed to update order in DB');
    }
  },

  // delete order
  async deleteOrderEmp(orderId: number): Promise<boolean> {
    try {
      const { rows } = await fastify.pg.query(
        deleteOrderQueryEmp,
        [orderId]
      );
      return rows.length > 0;
    }
    catch (error) {
      console.error('Failed to delete order in the DB', error);
      throw new Error('Failed to delete order in DB');
    }
  },

  // listing all orders
  async listAllOrdersEmp(): Promise<Order[]> {
    try {
      const { rows } = await fastify.pg.query(
        orderListQueryEmp
      );
      
      return rows;
    }
    catch (error) {
      console.error('Failed to list orders in the DB', error);
      throw new Error('Failed to list orders in DB');
    }
  }
});