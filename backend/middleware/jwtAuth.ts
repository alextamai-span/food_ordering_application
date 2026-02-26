import { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from '@fastify/jwt';

export async function verifyJWT(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // returns true/false if token is valid
    await request.jwtVerify();
  }
  catch (err) {
    reply.code(401).send({
      success: false,
      message: "Unauthorized or token expired"
    });
  }
}
