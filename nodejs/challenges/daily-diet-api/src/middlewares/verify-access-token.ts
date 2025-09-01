import { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "../utils/jwt";
import { AccessTokenPayload } from "../@types/fastify";

export async function verifyJWT(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return reply.status(401).send({ message: "Token ausente" });

    const token = authHeader.split(" ")[1];
    const payload = (await verifyAccessToken(token)) as AccessTokenPayload;

    req.user = payload;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido" });
  }
}
