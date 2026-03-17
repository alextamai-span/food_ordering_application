import { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from '@fastify/jwt';

/*
  preHandler for each of the protected routes to block unauthenticated requests.
  On success: populates request.user with the decoded payload ({ id, email })
  On failure: responds with 401 and halts the request lifecycle
*/
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
