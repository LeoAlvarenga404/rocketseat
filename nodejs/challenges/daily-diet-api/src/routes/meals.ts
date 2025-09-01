import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/verify-access-token";
import { knex } from "../database";
import z from "zod";
import { randomUUID} from "node:crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: verifyJWT,
    },
    async (req, reply) => {
      const userId = req?.user?.sub;

      const meals = await knex("meals").select("*").where("user_id", userId);

      if (meals.length <= 0) return reply.status(404).send();

      return reply.status(200).send({ meals });
    }
  );

  app.post(
    "/",
    {
      preHandler: verifyJWT,
    },
    async (req, reply) => {
      const userId = req?.user?.sub;

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        is_diet: z.boolean(),
      });

      const { name, description, is_diet } = createMealBodySchema.parse(
        req.body
      );

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        is_diet,
        user_id: userId,
      });

      return reply.status(201).send();
    }
  );
}
