import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm";
import { Profile } from "./profile.model";
import { Job } from "./job.model";

@Entity()
export class Contract extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    terms!: string;

    @Column({ type: "enum", enum: ["new", "in_progress", "terminated"] })
    status!: "new" | "in_progress" | "terminated";

    @ManyToOne(() => Profile, (profile) => profile.contractsAsClient)
    client!: Profile;

    @ManyToOne(() => Profile, (profile) => profile.contractsAsContractor)
    contractor!: Profile;

    @OneToMany(() => Job, job => job.contract)
    jobs!: Job[];

}

export interface CreateContractInfo {
    contractorId: number;
    terms: string;
}


export enum ContractStatusEnum {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    TERMINATED = "terminated"
}
