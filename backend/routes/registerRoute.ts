import { FastifyInstance } from 'fastify';
import { RegisterController } from '../controllers/registerController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function registerRoutes(fastify: FastifyInstance) {
    // run JWT validation before all routes in this plugin
    fastify.addHook('preHandler', verifyJWT);
    
    fastify.post('/register', RegisterController.register);
}