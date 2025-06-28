import { FastifyRequest, FastifyReply } from "fastify";
import { Profile } from "../models/profile.model";
import { CreateJobInfo } from "../models/job.model";
import { 
    getAllJobsService, 
    getUnpaidJobsService, 
    payForJobService, 
    getBestProffessionService, 
    getBestClientService, 
    createJobService,
} from "../services/job.service";

export const createJob = async (
    req: FastifyRequest<{ Body: CreateJobInfo }>,
    reply: FastifyReply
    ) => {
    try {
        const user = req.user as Profile;
        const job = await createJobService(user, req.body);
        return reply.status(201).send({ message: "Job created successfully", job });
    } catch (error: any) {
        reply.status(400).send({ message: "Error creating job", error: error.message });
    }
};

export const getJobs = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = req.user as Profile;
        const allJobs = await getAllJobsService(user);
        return reply.status(200).send({ message: "Jobs retrieved successfully", allJobs });
    } catch (error: any) {
        reply.status(400).send({ message: "Error fetching jobs", error: error.message });
    }
};

export const getUnpaidJobs = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const user = req.user as Profile;
        const unpaidJobs = await getUnpaidJobsService(user);
        return reply.status(200).send({ message: "Unpaid jobs retrieved successfully", unpaidJobs });
    } catch (error: any) {
        reply.status(400).send({ message: "Error fetching unpaid jobs", error: error.message });
    }
};

export const payForJob = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
        const user = req.user as Profile;
        const jobId = parseInt(req.params.id);
        const job = await payForJobService(user, jobId);
        return reply.status(200).send({ message: "Job paid successfully", job });
    } catch (error: any) {
        reply.status(400).send({ message: "Error paying for job", error: error.message });
    }
};

export const getBestProffession = async (req: FastifyRequest<{ Querystring: { start: string; end: string } }>, reply: FastifyReply) => {
    try {
        const { start, end } = req.query;
        const bestProffession = await getBestProffessionService(start, end);
        return reply.status(200).send({ message: "Best profession retrieved successfully", bestProffession });
    } catch (error: any) {
        reply.status(400).send({ message: "Error fetching best profession", error: error.message });
    }
};

export const getBestClient = async (req: FastifyRequest<{ Querystring: { start: string; end: string; limit?: string } }>, reply: FastifyReply) => {
    try {
        const { start, end, limit } = req.query;
        const bestClient = await getBestClientService(start, end, limit? parseInt(limit) : undefined);
        return reply.status(200).send({ message: "Best client retrieved successfully", bestClient });
    } catch (error: any) {
        reply.status(400).send({ message: "Error fetching best client", error: error.message });
    }
};