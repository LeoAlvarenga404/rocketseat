import { app } from "./app";
import { env } from "./env";
import cookie from "@fastify/cookie";
import { authRoutes } from "./routes/auth";
import { mealsRoutes } from "./routes/meals";

app.register(cookie);

app.register(authRoutes, {
  prefix: "auth",
});

app.register(mealsRoutes, {
  prefix: "meals",
});

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running on port: ", env.PORT);
});
