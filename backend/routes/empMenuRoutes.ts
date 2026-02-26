import { FastifyInstance } from 'fastify';
import { EmpMenuController } from '../controllers/empMenuController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function empMenuRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);

  fastify.get('/list', EmpMenuController.listEmpMenu);
  fastify.post('/add', EmpMenuController.addMenuItemEmp);
  fastify.put('/update', EmpMenuController.updateMenuItemEmp);
  fastify.put('/delete', EmpMenuController.deleteMenuItemEmp);
};
