import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { env } from './env';

export const buildFastify = () => {
  const fastify = Fastify({ logger: true });

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
