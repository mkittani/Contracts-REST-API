import { Job, CreateJobInfo } from "../models/job.model";
import { Profile } from "../models/profile.model";
import { Contract, ContractStatusEnum } from "../models/contract.model"; 
import { AppDataSource } from "../dbConnection";

export const createJobService = async (user: Profile, jobData: CreateJobInfo) => {
    const { description, price, contractId } = jobData;

    if (!contractId || typeof contractId !== 'number') { throw new Error("Invalid or missing contractId"); }        
    if (!description || typeof description !== 'string') { throw new Error("Invalid or missing job description"); }
    if (!price || typeof price !== 'number' ) { throw new Error("Invalid or missing job price"); }
       
    const contract = await Contract.findOne({
        where: { id: contractId },
        relations: ["client", "contractor"],
    });

    if (!contract) { throw new Error("Contract not found"); }
    if (contract.client.id !== user.id) { throw new Error("Unauthorized to create job for this contract"); }

    if (contract.status !== ContractStatusEnum.IN_PROGRESS) {
        contract.status = ContractStatusEnum.IN_PROGRESS;
        await contract.save();
    }
    

    const job = Job.create({
        description,
        price,
        paid: false,
        contract,
    });

    await job.save();
    return job;
};

export const getAllJobsService = async (user: Profile) => {
    const allJobs = await Job.find({
        where: [
            { contract: { client: { id: user.id } } },
            { contract: { contractor: { id: user.id } } }
        ],
        relations: ["contract", "contract.client", "contract.contractor"],
    });

    if (!allJobs.length) { throw new Error("No jobs found"); }
       
    return allJobs;
};

export const getUnpaidJobsService = async (user: Profile) => {
    const unpaidJobs = await Job.find({
        where: [
            { paid: false, contract: { client: { id: user.id }, status: ContractStatusEnum.IN_PROGRESS } },
            { paid: false, contract: { contractor: { id: user.id }, status: ContractStatusEnum.IN_PROGRESS } }
        ],
        relations: ["contract", "contract.client", "contract.contractor"],
    });

    if (!unpaidJobs.length) { throw new Error("No unpaid jobs found"); }

    return unpaidJobs;
};

export const payForJobService = async (client: Profile, jobId: number) => {
    return AppDataSource.transaction(async (manager) => {
        const job = await manager.findOne(Job, {
            where: { id: jobId },
            relations: ["contract", "contract.client", "contract.contractor"],
            lock: { mode: "pessimistic_write" },
        });

        if (!job) throw new Error("Job not found");
        if (job.paid) throw new Error("Job already paid");
        if (job.contract.client.id !== client.id) throw new Error("You are not the client of this job");

        const contractor = await manager.findOne(Profile, {
            where: { id: job.contract.contractor.id },
            lock: { mode: "pessimistic_write" },
        });

        const lockedClient = await manager.findOne(Profile, {
            where: { id: client.id },
            lock: { mode: "pessimistic_write" },
        });

        if (!contractor || !lockedClient) throw new Error("User not found");
        if (lockedClient.balance < job.price) throw new Error("Insufficient balance");

        await manager.increment(Profile, { id: client.id }, "balance", -job.price);
        await manager.increment(Profile, { id: contractor.id }, "balance", job.price);

        job.paid = true;
        job.paymentDate = new Date();
        await manager.save(job);

        return job;
    });
};

export const getBestProffessionService = async (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format");
    }

    type JobEarning = {
        date: string;
        profession: string;
        earned: string; 
    };
    
    const jobs = await AppDataSource
        .getRepository(Job)
        .createQueryBuilder("job")
        .innerJoin("job.contract", "contract")
        .innerJoin("contract.contractor", "profile")
        .select([
            `TO_CHAR(job.paymentDate, 'YYYY-MM-DD') AS date`,
            "profile.profession AS profession",
            "SUM(job.price) AS earned",
        ])
        .where("job.paid = true")
        .andWhere("job.paymentDate BETWEEN :start AND :end", {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        })
        .groupBy("date, profile.profession")
        .orderBy("date", "ASC")
        .addOrderBy("earned", "DESC")
        .getRawMany<JobEarning>();

    if (!jobs.length) {
        throw new Error("No jobs found");
    }
    
    const topPerDay: Record<string, { profession: string, earned: number }> = {};
    jobs.forEach(({ date, profession, earned }) => {
        if (!topPerDay[date]) {
            topPerDay[date] = {
                profession,
                earned: Number(parseFloat(earned).toFixed(2)),
            };
        }
    });

    return Object.entries(topPerDay).map(([date, data]) => ({
        date,
        profession: data.profession,
        earned: data.earned,
    }));
};

export const getBestClientService = async (start: string, end: string, limit = 2) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format");
    }

    type ClientEarning = {
        id: number;
        fullName: string;
        paid: string;
    };

    const jobs = await AppDataSource
        .getRepository(Job)
        .createQueryBuilder("job")
        .innerJoin("job.contract", "contract")
        .innerJoin("contract.client", "client")
        .select([
            "client.id AS id",
            `CONCAT(client.firstName, ' ', client.lastName) AS fullName`,
            "SUM(job.price) AS paid",
        ])
        .where("job.paid = true")
        .andWhere("job.paymentDate BETWEEN :start AND :end", {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        })
        .groupBy("client.id, client.firstName, client.lastName")
        .orderBy("paid", "DESC")
        .limit(limit)
        .getRawMany<ClientEarning>();

    if (!jobs.length) {
        throw new Error("No jobs found");
    }

    return jobs.map((row) => ({
        id: row.id,
        fullName: row.fullName,
        paid: Number(parseFloat(row.paid).toFixed(2)),
    }));
};