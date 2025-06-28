import "reflect-metadata";
import { DataSource } from "typeorm";
import { Profile } from "./models/profile.model";
import { Contract } from "./models/contract.model";
import dotenv from "dotenv";
import { Job } from "./models/job.model";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
    logging: false,
    entities: [Profile, Contract, Job],
});