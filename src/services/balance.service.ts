import { Profile } from "../models/profile.model";
import { Job } from "../models/job.model";
import { AppDataSource } from "../dbConnection";

export const depositBalanceService = async (userId: number, amount: number) => {
     return AppDataSource.transaction(async (manager) => {
        const user = await manager.findOne(Profile, {
            where: { id: userId },
            lock: { mode: "pessimistic_write" },
        });

        if (!user) {throw new Error("User not found");}
        if (user.type !== "Client") {throw new Error("Only clients can deposit balance");}

        const unpaidJobs = await manager.find(Job, {
            where: {
                paid: false,
                contract: { 
                    client: {
                        id: userId,
                    },
                },
            },
        relations: ["contract", "contract.client", "contract.contractor"],
        });

        const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
        const maxAllowedDeposit = totalUnpaid * 0.25;

        if (amount > maxAllowedDeposit) {
            throw new Error(`Deposit exceeds allowed limit. Max: ${maxAllowedDeposit.toFixed(2)}`);
        }

        await manager.increment(Profile, { id: userId }, "balance", amount);

        const updatedUser = await manager.findOneBy(Profile, { id: userId });
        return { balance: updatedUser?.balance };

    });
};
