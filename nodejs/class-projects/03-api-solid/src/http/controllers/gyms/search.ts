import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(req: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { page, query } = searchGymsQuerySchema.parse(req.query);

  const registerUseCase = makeSearchGymsUseCase();

  const {gyms} = await registerUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({
    gyms,
  });
}
