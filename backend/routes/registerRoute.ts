import { FastifyInstance } from 'fastify';
import { RegisterController } from '../controllers/registerController.ts';

export default async function registerRoutes(fastify: FastifyInstance) {
   
    fastify.post('/register', {
        schema: {
            description: 'Register a new user with name, email, password and account type',
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    name: { type: 'string', minLength: 1 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    account_type: { type: 'string', enum: ['guest', 'employee'] },
                },
                required: ['name', 'email', 'password', 'account_type'],
            },
            response: {
                201: {
                    type: 'object',
                    description: 'User registered successfully',
                    properties: {
                        token: { type: 'string' },
                        message: { type: 'string' },
                        id: { type: 'number' },
                        accountId: { type: 'number' },
                        account_type: { type: 'string' }
                    },
                },
                400: {
                    type: 'object',
                    description: 'Invalid input data',
                    properties: {
                        message: { type: 'string' },
                    },
                },
                409: {
                    type: 'object',
                    description: 'User already exists',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                    }
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
    }, RegisterController.register);
}