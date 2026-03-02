import { FastifyInstance } from 'fastify';
import { RegisterController } from '../controllers/registerController.ts';

export default async function registerRoutes(fastify: FastifyInstance) {
   
    fastify.post('/register', RegisterController.register);
}