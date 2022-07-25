import prisma from "../config/database.js";
import { User } from "@prisma/client";

export type userData = Omit<User, "id" | "createdAt">;

async function findUserByEmail(email : string) {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
}

async function insertUser(user : userData) {
    await prisma.user.create({
        data: user
    });
}

const authRepository = {
    findUserByEmail,
    insertUser,
};

export default authRepository;