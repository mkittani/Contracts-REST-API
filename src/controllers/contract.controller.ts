import { FastifyRequest, FastifyReply } from "fastify";
import { CreateContractInfo, ContractStatusEnum } from "../models/contract.model";
import { createNewContract, getContractByIdService, getContractsByStatusService } from "../services/contract.service";
import { Profile } from "../models/profile.model";

export const createContract = async (
    req: FastifyRequest<{ Body: CreateContractInfo }>,
    reply: FastifyReply
    ) => {
    try {
        const user = req.user as Profile;
        const contract = await createNewContract(user, req.body);
        return reply.status(201).send({ message: "Contract created successfully", contract });
    } catch (error: any) {
        console.error("Error creating contract:", error);
        return reply.status(400).send({ message: error.message || "Error creating contract" });
    }
};

export const getContractById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
    ) => {
    try {
        const user = req.user as Profile;
        const contractId = parseInt(req.params.id, 10);
        const contract = await getContractByIdService(user, contractId);
        return reply.status(200).send({ message: "Contract retrieved successfully", contract });
    } catch (error: any) {
        console.error("Error fetching contract by ID:", error);
        return reply.status(404).send({ message: error.message || "Contract not found" });
    }
};

export const getContractsByStatus = async (
    req: FastifyRequest<{ Querystring: { status?: ContractStatusEnum } }>,
    reply: FastifyReply
    ) => {
    try {
        const user = req.user as Profile;
        const contracts = await getContractsByStatusService(user, req.query.status);
        return reply.status(200).send({ message: "Contracts retrieved successfully", contracts });
    } catch (error: any) {
        console.error("Error fetching contracts by status:", error);
        return reply.status(404).send({ message: error.message || "No contracts found" });
    }
};
