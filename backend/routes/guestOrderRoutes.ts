import { FastifyInstance } from 'fastify';
import { GuestOrderController } from '../controllers/guestOrderController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function guestOrderRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);
  
  // route for a guest to place a new order
  fastify.post('/new_order:userId', {
    schema: {
      description: 'Place a new order for a guest',
      "tags": ["guest"],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          userId: { type: 'integer' }
        },
        required: ['userId']
      },
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          
          total_price: { type: 'number', minimum: 0 },
          order_status: { type: 'string' },
        },
        required: ['total_price', 'order_status'],
      },
      response: {
        201: {
          type: 'object',
          description: 'Order created successfully',
          properties: {
            orderId: { type: 'integer' },
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          description: 'Invalid input data',
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
  }, GuestOrderController.addOrder);

  // route for a guest to list all their orders
  fastify.get('/list:userId', {
    schema: {
      description: 'List all guest orders',
      "tags": ["guest"],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          userId: { type: 'integer' }
        },
        required: ['userId']
      },
      response: {
        200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            foodItems: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  itemName: { type: 'string' },
                  quantity: { type: 'integer', minimum: 1 },
                },
                required: ['itemName', 'quantity']
              }
            },
            total_price: { type: 'number', minimum: 0 },
            order_status: { type: 'string' },
          },
          required: ['id', 'total_price', 'order_status']
        }
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
  }, GuestOrderController.listOrders);
};
