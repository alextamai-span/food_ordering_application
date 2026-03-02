import { FastifyInstance } from 'fastify';
import { GuestMenuController } from '../controllers/guestMenuController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function guestMenuRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);

  fastify.get('/list', {
    schema: {
      description: 'Get the list of available food items for guests',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              item: { type: 'string' },
              price: { type: 'number', minimum: 0 },
            },
            required: ['item', 'price']
          },
        },
        401: {
          type: 'object',
          description: 'Unauthorized: Invalid or missing token',
          properties: {
              message: { type: 'string' },
          },
        },
        500: {
          type: 'object',
          description: 'Server error',
          properties: {
              message: { type: 'string' },
          },
        },
      },
    },
  }, GuestMenuController.listGuestMenu);
};
