import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Contract } from "./contract.model";

@Entity()
export class Job extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column("float")
    price!: number;

    @Column({ default: false })
    paid!: boolean;

    @Column({ type: "timestamp", nullable: true })
    paymentDate!: Date;

    @ManyToOne(() => Contract, (contract) => contract.jobs)
    contract!: Contract;
}

export interface CreateJobInfo {
    description: string;
    price: number;
    contractId: number;
}