import { FastifyInstance } from "fastify";
import { createContract, getContractById, getContractsByStatus } from "../controllers/contract.controller";
import { verifyToken } from "../utils/auth";

export async function contractRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyToken);
  
    app.get("/contracts/:id", getContractById);
    app.get("/contracts", getContractsByStatus);
    app.post("/contracts", createContract);
  }