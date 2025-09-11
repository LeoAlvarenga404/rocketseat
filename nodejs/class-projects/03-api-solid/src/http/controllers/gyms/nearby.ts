import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { FetchNearbyGymsUseCase } from "@/use-cases/fetch-nearby-gyms";
import { makeFetchNearbyGymUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(req: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });
  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

  const registerUseCase = makeFetchNearbyGymUseCase();

  const { gyms } = await registerUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms,
  });
}
