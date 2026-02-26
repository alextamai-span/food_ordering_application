import { FastifyInstance } from 'fastify';
import { EmpOrderController } from '../controllers/empOrderController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function empOrderRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);
  
  fastify.get('/list', EmpOrderController.listOrdersEmp);
  fastify.put('/update', EmpOrderController.updateOrderEmp);
  fastify.put('/delete', EmpOrderController.deleteOrderEmp);
};
