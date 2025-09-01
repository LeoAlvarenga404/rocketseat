import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/verify-access-token";
import { knex } from "../database";
import z from "zod";
import { randomUUID } from "node:crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (req, res) => {
    await verifyJWT(req, res);
  });

  app.get("/", async (req, reply) => {
    const userId = req?.user?.sub;

    const meals = await knex("meals").select("*").where("user_id", userId);

    if (meals.length <= 0) return reply.status(404).send();

    return reply.status(200).send({ meals });
  });

  app.get("/:id", async (req, reply) => {
    const userId = req?.user?.sub;

    const getMealsParamsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = getMealsParamsSchema.parse(req.params);

    const meals = await knex("meals")
      .select("*")
      .where({
        user_id: userId,
        id,
      })
      .first();

    return reply.status(200).send({ meals });
  });

  app.get("/summary", async (req, reply) => {
    const userId = req?.user?.sub;

    const meals = await knex("meals").where("user_id", userId).select();

    const totalMeals = meals.length;

    const totalMealsWithinTheDiet = meals.filter(
      (meal) => !!meal.is_diet
    ).length;

    const totalMealsWithoutTheDiet = meals.filter(
      (meal) => !meal.is_diet
    ).length;

    return { totalMeals, totalMealsWithinTheDiet, totalMealsWithoutTheDiet };
  });

  app.post("/", async (req, reply) => {
    const userId = req?.user?.sub;

    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      is_diet: z.boolean(),
    });

    const { name, description, is_diet } = createMealBodySchema.parse(req.body);

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      is_diet,
      user_id: userId,
    });

    return reply.status(201).send();
  });

  app.put("/:id", async (req, reply) => {
    const userId = req?.user?.sub;

    const updateMealsBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      is_diet: z.boolean().optional(),
    });

    const { name, description, is_diet } = updateMealsBodySchema.parse(
      req.body
    );

    await knex("meals")
      .update({
        name,
        description,
        is_diet,
        updated_at: new Date(),
      })
      .where("user_id", userId);

    return reply.status(200).send();
  });

  app.delete("/:id", async (req, reply) => {
    const userId = req?.user?.sub;

    const deleteMealsParamsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = deleteMealsParamsSchema.parse(req.params);

    await knex("meals").delete().where({
      user_id: userId,
      id,
    });

    return reply.status(204).send();
  });
}
