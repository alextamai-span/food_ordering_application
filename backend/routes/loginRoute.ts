import { FastifyInstance } from 'fastify';
import { LoginController } from '../controllers/loginController.ts';

export default async function loginRoutes(fastify: FastifyInstance) {
  
    fastify.post('/login', {
      // schema: validate request.body
      // validates the structure, types, minimun length and email format
      // does not hash, check email in DB, password requirements, 
      schema: {
        // description: what this route does, used for documentation
        description: 'Login a user with email and password',
        // body: whats in the request.body
        body: {
          // type: what type of data we expect
          type: 'object',
          // additionalProperties: do not allow new/extra fields
          additionalProperties: false,
          // properties: the fields we expect in the body and their types
          properties: {
            // email: should be a string and in email format
            email: { type: 'string', format: 'email' },
            // password: should be a string and at least 8 characters long
            password: { type: 'string', minLength: 8,  },
          },
          // required: which fields are required in the body
          required: ['email', 'password'],
        },
        // response: what should be sent back in the response
        // used for documentation and validation of the response
        response: {
          // 200 - success
          200: {
            type: 'object',
            description: 'Successful login',
            properties: {
              token: { type: 'string' },
              message: { type: 'string' },
              id: { type: 'number' },
              accountId: { type: 'number' },
              account_type: { type: 'string' }
            },
          },
          // 400 - bad request: invalid input
          400: {
            type: 'object',
            description: 'Invalid input data',
            properties: {
                message: { type: 'string' },
            },
          },
          // 401 - unauthorized: invalid credentials
          401: {
            type: 'object',
            description: 'Unauthorized: Invalid credentials',
            properties: {
                message: { type: 'string' },
            },
          },
          // 500 - internal server error
          500: {
            type: 'object',
            description: 'Server error',
            properties: {
                message: { type: 'string' },
            },
          },
        },
      },
    }, LoginController.login);
}