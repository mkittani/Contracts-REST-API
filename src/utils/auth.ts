import  jwt, { JwtPayload}  from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";
import { Profile } from "../models/profile.model";

const SECRET = process.env.JWT_SECRET as string;

declare module "fastify" {
    interface FastifyRequest {
      user: Profile;
    }
  }

export const verifyToken = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ message: "Missing or malformed token" });
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET) as JwtPayload;
  
      const user = await Profile.findOneBy({ id: decoded.id });
      if (!user) {
        return reply.status(401).send({ message: "Invalid user" });
      }
  
      req.user = user;
    } catch (err) {
      return reply.status(401).send({ message: "Invalid token" });
    }
  };

  export const verifyJWT = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
};