import { depositBalance } from "../controllers/balance.controller";
import { FastifyInstance } from "fastify";
import { verifyToken } from "../utils/auth";

export async function balanceRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyToken);

    app.post("/balances/deposit/:userId", depositBalance);
}
