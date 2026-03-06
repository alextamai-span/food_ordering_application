import { FastifyInstance } from 'fastify';
import { EmpOrderController } from '../controllers/empOrderController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function empOrderRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);
  
  // route for create a new order for an employee
  fastify.post('/new_order', {
    schema: {
      description: 'Create a new order for an employee',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
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
                quantity: { type: 'integer', minimum: 1 }
              },
              required: ['foodItemId', 'quantity']
            }
          }
        }
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
        500 :{
          type : "object",
          description : "Server error",
          properties :{
            message : {type : "string"}
          }
        }
      }
    }
  }, EmpOrderController.createOrderEmp);

  // route for list all orders for an employee
  fastify.get('/list', {
    schema: {
      description: 'List all orders for an employee',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              user_id: { type: 'number' },
              total_price: { type: 'number', minimum: 0 },
              order_status: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              completed_at: { type: 'string', format: 'date-time' },
            },
            required: ['id', 'user_id', 'total_price', 'order_status', 'created_at', 'completed_at']
          },
        },
        401: {
          type: 'object',
          description: 'Unauthorized: Invalid or missing token',
          properties: {
              message: { type: 'string' },
          },
        },
        500 :{
          type : "object",
          description : "Server error",
          properties :{
            message : {type : "string"}
          }
        }
      }
    }
  }, EmpOrderController.listOrdersEmp);

  // route for updating an order
  fastify.put('/update_order:id', {
    schema: {
      description: 'Updating an order',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          user_id: { type: 'number' },
          total_price: { type: 'number', minimum: 0 },
          order_status: { type: 'string' },
          completed_at: { type: 'string' },
        },
        required: ['order_status'],
      },
      response: {
        201: {
          type: 'object',
          description: 'Order updated successfully',
          properties: {
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
        500 :{
          type : "object",
          description : "Server error",
          properties :{
            message : {type : "string"}
          }
        }
      }
    }
  }, EmpOrderController.updateOrderEmp);

  // route for soft deleting an order
  fastify.put('/delete_order:id', {
    schema: {
      description: 'Delete order',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      },
      response: {
        201: {
          type: 'object',
          description: 'Order deleted successfully',
          properties: {
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
        500 :{
          type : "object",
          description : "Server error",
          properties :{
            message : {type : "string"}
          }
        }
      }
    }
  }, EmpOrderController.deleteOrderEmp);
};
