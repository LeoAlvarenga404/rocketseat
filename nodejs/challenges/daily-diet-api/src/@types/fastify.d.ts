import { FastifyRequest } from "fastify";
import { JWTPayload } from "jose";

interface AccessTokenPayload extends JWTPayload {
  sub: string;
  name: string;
  email: string;
}
declare module "fastify" {
  interface FastifyRequest {
    user?: AccessTokenPayload;
  }
}
