import { FastifyRequest, FastifyReply } from "fastify";
import { depositBalanceService } from "../services/balance.service";

export const depositBalance = async (
    req: FastifyRequest<{ Params: { userId: string }, Body: { amount: number } }>,
    reply: FastifyReply
) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return reply.status(400).send({ error: "Amount must be a positive number" });
    }

    try {
        const result = await depositBalanceService(Number(userId), amount);
        return reply.status(200).send({ message: "Deposit successful", result });
    } catch (error: any) {
        reply.status(400).send({ message: "Error depositing balance", error: error.message });
    }
};
