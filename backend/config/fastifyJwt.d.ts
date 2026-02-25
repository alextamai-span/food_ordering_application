import "@fastify/jwt";
import 'fastify';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    // the decoded payload
    payload: {
      id: any;
      email?: any;
    };
    // user after jwtVerify()
    user: {
      id: any;
      email?: any;
    };
 }
}
