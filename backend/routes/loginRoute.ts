import { FastifyInstance } from 'fastify';
import { LoginController } from '../controllers/loginController.ts';

export default async function loginRoutes(fastify: FastifyInstance) {
  
    fastify.post('/login', LoginController.login);
}