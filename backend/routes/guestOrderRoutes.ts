import { FastifyInstance } from 'fastify';
import { GuestOrderController } from '../controllers/guestOrderController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function guestOrderRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);
  
  fastify.post('/new_order', GuestOrderController.addOrder);
  fastify.get('/list', GuestOrderController.listOrders);
};
