import { FastifyInstance } from "fastify";
import { signUp, signIn, getProfile } from "../controllers/profile.controller";

export async function profileRoutes(app: FastifyInstance) {
  app.post("/signup", signUp);
  app.post("/login", signIn);
  app.get("/profile", getProfile);
}
