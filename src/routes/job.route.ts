import { FastifyInstance } from "fastify";
import { getJobs, getUnpaidJobs, payForJob, getBestProffession, getBestClient, createJob } from "../controllers/job.controller";
import { verifyToken } from "../utils/auth";

export async function jobRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyToken);

  app.post("/jobs", createJob);
  app.get("/jobs", getJobs);
  app.get("/jobs/unpaid", getUnpaidJobs);
  app.post("/jobs/:id/pay", payForJob);
  app.get("/jobs/best-profession", getBestProffession);
  app.get("/jobs/best-clients", getBestClient);
}
