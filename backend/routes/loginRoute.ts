import { FastifyInstance } from 'fastify';
import { LoginController } from '../controllers/loginController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function loginRoutes(fastify: FastifyInstance) {
    // run JWT validation before all routes in this plugin
    fastify.addHook('preHandler', verifyJWT);
    
    fastify.post('/login', LoginController.login);
}