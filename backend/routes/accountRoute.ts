import { FastifyInstance } from 'fastify';
import { AccountController } from '../controllers/accountController.ts';
import { verifyJWT } from '../middleware/jwtAuth.ts';

export default async function AccountRoutes(fastify: FastifyInstance) {
    fastify.addHook("preHandler", verifyJWT);
  
    // route for deleting a user account
    fastify.put('/delete_account:id', {
      schema: {
        description: 'Delete a user account',
        params: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'number' },
          },
          required: ['id'],
        },
        response: {
          // 200 - success
          200: {
            type: 'object',
            description: 'Successful account deletion',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              id: { type: 'number' },
            },
          },
          // 400 - bad request: invalid input
          400: {
            type: 'object',
            description: 'Invalid input data',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
          },
          // 401 - unauthorized: invalid credentials
          401: {
            type: 'object',
            description: 'Unauthorized: Invalid credentials',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
          },
          // 500 - internal server error
          500: {
            type: 'object',
            description: 'Server error',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
          },
        },
      },
    }, AccountController.deleteAccount);

    // route for updating a user account
    fastify.put('/update_account:id', {
      schema: {
        description: 'Update a user account',
        params: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'number' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            account_type: { type: 'string' },
          },
        },
        response: {
          // 200 - success
          200: {
            type: 'object',
            description: 'Successful account update',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { type: 'object' },
            },
          },
          // 400 - bad request: invalid input
          400: {
            type: 'object',
            description: 'Invalid input data',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
          },
          // 401 - unauthorized: invalid credentials
          401: {
            type: 'object',
            description: 'Unauthorized: Invalid credentials',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
          },
          // 500 - internal server error
          500: {
            type: 'object',
            description: 'Server error',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
          },
        },
      },
    }, AccountController.updateAccount);

    // route for getting employee data
    fastify.get('/account:empId', {
      schema: {
        description: 'Getting the employee data',
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
          500: {
            type: 'object',
            description: 'Server error',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    }, AccountController.getAccount);

}
