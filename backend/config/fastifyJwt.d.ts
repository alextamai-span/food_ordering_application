import "@fastify/jwt";
import 'fastify';

/*
  This tells TypeScript the contents of the JWT payload and the 
  expected shape of the JWT payload and the decoded user object.
*/
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
