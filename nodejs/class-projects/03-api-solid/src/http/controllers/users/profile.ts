import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
export async function profile(req: FastifyRequest, reply: FastifyReply) {

  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({
    userId: req.user.sub,
  });

  const { password_hash, ...userWithoutPassword } = user;

  return reply.status(200).send({
    user: userWithoutPassword,
  });
}
