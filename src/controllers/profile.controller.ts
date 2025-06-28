import { FastifyReply, FastifyRequest } from "fastify";
import { signupUser, loginUser, getProfileByToken } from "../services/profile.service";
import { SignupUserData, LoginUserData } from "../models/profile.model";

export const signUp = async (req: FastifyRequest<{ Body: SignupUserData}>, reply: FastifyReply) => {
    try{
        const result = await signupUser(req.body);
        if (result) {
            reply.code(201).send(result);
        } else {
            reply.code(400).send({ message: "User already exists" });
        }
    } catch (error: any) {
        console.error("Error in signUp controller:", error);
        reply.code(400).send({ message: error.message });
    }
};

export const signIn = async (req: FastifyRequest<{ Body: LoginUserData}>, reply: FastifyReply) => {
    try {
        const token = await loginUser(req.body);
        if (token) {
            reply.code(200).send({ token });
        } else {
            reply.code(401).send({ message: "Invalid credentials" });
        }
    } catch (error: any) {
        console.error("Error in signIn controller:", error);
        reply.code(401).send({ message: error.message });
    }
};

export const getProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ message: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1];
        const user = await getProfileByToken(token);
        if (user) {
            reply.code(200).send(user);
        } else {
            reply.code(401).send({ message: "Invalid token" });
        }
    } catch (error: any) {
        console.error("Error in getProfile controller:", error);
        reply.code(401).send({ message: error.message });
    }
};

