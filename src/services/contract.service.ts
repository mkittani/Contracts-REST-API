import { Contract, CreateContractInfo } from "../models/contract.model";
import { Profile } from "../models/profile.model";
import { ContractStatusEnum } from "../models/contract.model";

export const createNewContract = async (user: Profile, data: CreateContractInfo) => {
    if (user.type !== "Client") {
        throw new Error("Only clients can create contracts");
    }

    if (!data.contractorId || typeof data.contractorId !== 'number') {
        throw new Error("Invalid or missing contractorId");
    }

    if (!data.terms || typeof data.terms !== 'string' || data.terms.trim().length === 0) {
        throw new Error("Invalid or missing contract terms");
    }

    const contractor = await Profile.findOneBy({ id: data.contractorId });
    if (!contractor) {
        throw new Error(`Contractor with ID ${data.contractorId} does not exist`);
    }

    if (contractor.type !== "Contractor") {
        throw new Error(`User with ID ${data.contractorId} is not a contractor`);
    }

    const contract = Contract.create({
        terms: data.terms,
        status: ContractStatusEnum.NEW,
        client: user,
        contractor,
    });

    await contract.save();
    return contract;
};

export const getContractByIdService = async (user: Profile, contractId: number) => {
    if (!contractId || typeof contractId !== 'number') {
      throw new Error("Invalid or missing contract ID");
    }

    const contract = await Contract.findOne({
      where: { id: contractId },
      relations: ["client", "contractor"]
    });
  
    if (!contract || (contract.client.id !== user.id && contract.contractor.id !== user.id)) {
      throw new Error("Contract not found or access denied");
    }
  
    return contract;
  };

export const getContractsByStatusService = async (
    user: Profile,
    status?: ContractStatusEnum
    ) => {
    if (status && !Object.values(ContractStatusEnum).includes(status)) {
        throw new Error("Invalid contract status");
    }

    const contracts = await Contract.find({
        where: [
            { client: { id: user.id }, status },
            { contractor: { id: user.id }, status }
        ],
        relations: ["client", "contractor"]
    });

    if (!contracts.length) {
        throw new Error("No contracts found");
    }

    return contracts;
};
