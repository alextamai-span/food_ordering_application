import { FastifyInstance } from 'fastify';
import { GuestMenuController } from '../controllers/guestMenuController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function guestMenuRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);

  fastify.get('/list', GuestMenuController.listGuestMenu);
};
