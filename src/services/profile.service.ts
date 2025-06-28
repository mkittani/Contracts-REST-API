import { Profile } from "../models/profile.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignupUserData, LoginUserData } from "../models/profile.model";
import { verifyJWT } from "../utils/auth";

const SECRET = process.env.JWT_SECRET as string;

export const signupUser = async (data: SignupUserData) => {
    const { firstName, lastName, profession, balance, type, username, password} = data;

    if (!firstName || !lastName || !profession || !balance || !type || !username || !password) {
        throw new Error("All fields are required");
    }

    const existing = await Profile.findOneBy({ username });
    if (existing) { throw new Error("Username already exists"); }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newProfile = Profile.create({
        firstName,
        lastName,
        profession,
        balance,
        type,
        username,
        password: hashedPassword
    });
    await newProfile.save();
    return newProfile;
};

export const loginUser = async (data: LoginUserData) =>{
    const { username, password } = data;

    if (!username || !password) { throw new Error("Username and password are required"); }

    const user = await Profile.findOneBy({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }

    return jwt.sign({ id: user.id, username: user.username }, SECRET);
};

export const getProfileByToken = async (token: string) => {
    try {
        const decodedToken = verifyJWT(token);
        if (!decodedToken) {
            throw new Error("Invalid token");
        }
        const user = await Profile.findOneBy({ id: decodedToken.id });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (err) {
        throw new Error("Invalid token");
    }
};