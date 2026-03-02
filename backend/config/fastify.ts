import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { env } from './env';

export const buildFastify = () => {
  const fastify = Fastify({ logger: true });

  // register Swagger/OpenAPI first so schemas from later routes are collected
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Food Ordering API',
        description: 'Documentation for the food ordering backend',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
    },
  });

  fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  fastify.register(fastifyPostgres, {
    connectionString: env.DATABASE_URL,
  });

  fastify.register(fastifyCors, {
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // JWT config
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
  });

  // Auth guard
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      // return the user data
      await request.jwtVerify();
    }
    catch {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  return fastify;
};
