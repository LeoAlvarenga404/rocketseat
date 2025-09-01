import { FastifyInstance } from "fastify";
import z from "zod";
import { hashPassword, comparePassword } from "../utils/hash";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { signAccessToken } from "../utils/jwt";
export async function authRoutes(app: FastifyInstance) {
  app.post("/login", async (req, reply) => {
    const loginBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = loginBodySchema.parse(req.body);

    const user = await knex("users").select("*").where("email", email).first();

    if (!user) {
      return reply.status(401).send({ error: "Email ou senha inválida" });
    }

    const { password: hashPassword } = user;

    const verifyPassword = await comparePassword(password, hashPassword);

    if (verifyPassword === false) {
      return reply.status(401).send({ error: "Email ou senha inválida" });
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email,
    };

    const accessToken = await signAccessToken(payload);

    reply.header("Authorization", `Bearer ${accessToken}`);

    return reply.send({ accessToken });
  });

  app.post("/register", async (req, reply) => {
    try {
      const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      });

      const { name, email, password } = createUserBodySchema.parse(req.body);

      const hashedPassword = await hashPassword(password);

      await knex("users").insert({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
      });

      return reply.status(201).send();
    } catch (error) {
      return reply.status(500).send(`Erro ao cadastrar usuário: ${error}`);
    }
  });
}
