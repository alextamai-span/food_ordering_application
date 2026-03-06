import { FastifyInstance } from 'fastify';
import { EmpMenuController } from '../controllers/empMenuController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function empMenuRoutes(fastify: FastifyInstance) {
  // run JWT validation before all routes in this plugin
  fastify.addHook('preHandler', verifyJWT);

  // route for listing all items for employees
  fastify.get('/list', {
    schema: {
      description: 'Listing all the items for an employee',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              item_name: { type: 'string' },
              price: { type: 'number', minimum: 0 },
              quantity: { type: 'integer', minimum: 1 },
              available: { type: 'boolean' }
            },
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
  }, EmpMenuController.listEmpMenu);

  // route for adding a new item to the menu
  fastify.post('/add_item', {
    schema: {
      description: 'Create a new menu item',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          item_name: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          quantity: { type: 'integer', minimum: 1 },
          available: { type: 'boolean' }
        },
        required: ['item_name', 'price', 'quantity', 'available']
      },
      response: {
        201: {
          type: 'object',
          description: 'Item created successfully',
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
  }, EmpMenuController.addMenuItemEmp);

  // route for updating an item on the menu
  fastify.put('/update_item:itemId', {
    schema: {
      description: 'Updating an order',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          itemId: { type: 'integer' }
        },
        required: ['itemId']
      },
      body: {
        type: 'object',
        additionalProperties: false,
        properties: {
          item_name: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          quantity: { type: 'integer', minimum: 1 },
          available: { type: 'boolean' }
        },
      },
      response: {
        201: {
          type: 'object',
          description: 'Item updated successfully',
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
  }, EmpMenuController.updateMenuItemEmp);

  // route for deleting an item on the menu
  fastify.put('/delete_item:itemId', {
    schema: {
        description: 'Delete item',
        "tags": ["emp"],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            itemId: { type: 'integer' }
          },
          required: ['itemId']
        },
        response: {
          201: {
            type: 'object',
            description: 'Item deleted successfully',
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
  }, EmpMenuController.deleteMenuItemEmp);

  // route for getting employee data
  fastify.get('/account:empId', {
    schema: {
      description: 'Getting the employee data',
      "tags": ["emp"],
      security: [{ bearerAuth: [] }],
      params: {
          type: 'object',
          properties: {
            empId: { type: 'integer' }
          },
          required: ['empId']
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              account_type: { type: 'string' },
            },
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
  }, EmpMenuController.listEmpData);
};
