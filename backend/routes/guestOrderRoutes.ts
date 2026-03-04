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
          foodItems: {
            type: 'array',
            minItems: 1,
            items: { 
              type: 'object',
              additionalProperties: false,
              properties: {
                foodItemId: { type: 'integer' },
                quantity: { type: 'integer', minimum: 1 },
              },
              required: ['foodItemId', 'quantity'],
            },
          },
        },
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
            orderId: { type: 'integer' },
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
            totalPrice: { type: 'number', minimum: 0 },
            orderStatus: { type: 'string' },
          },
          required: ['orderId', 'foodItems', 'totalPrice', 'orderStatus']
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
