import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { env } from './env';

/*
  Builds and configures the Fastify server instance.
  Registers all required plugins: Swagger docs, PostgreSQL, CORS, JWT,
  and decorates the instance with an authentication guard.
*/
export const buildFastify = () => {
  const fastify = Fastify({ logger: true });

  // Register Swagger/OpenAPI first so route schemas are collected before the UI is served
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Food Ordering API',
        description: 'Documentation for the food ordering backend',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
      components: {
        securitySchemes: {
          // All protected routes expect a Bearer JWT in the Authorization header
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token from /login endpoint',
          },
        },
      },
    },
  });

  // Swagger UI documentation
  fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Connect to PostgreSQL 
  fastify.register(fastifyPostgres, {
    connectionString: env.DATABASE_URL,
  });

  // what HTTP requests methods are allowed by frontend
  fastify.register(fastifyCors, {
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // Register JWT plugin
  // tokens use the secret and expire after 15 minutes
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '15m',
    },
  });

  // authenticate hook added as a preHandler on protected routes
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      // Verify the JWT and attach the decoded payload to request.user
      await request.jwtVerify();
    }
    catch {
      // Return 401 if the token is missing, expired, or invalid
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  return fastify;
};
