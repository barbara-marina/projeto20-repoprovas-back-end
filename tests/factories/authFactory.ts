import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker"
import prisma from "../../src/config/database.js";
import { userData } from "../../src/repositories/authRepository.js";
import jwt from "jsonwebtoken";

function createLogin( email = "barbaramarina@mail.com", passwordLength = 10) {
    return {
        email,
        password: faker.internet.password(passwordLength)
    };
}

async function createUser({email, password} : userData) {
    const user = await prisma.user.create({
        data: {
            email,
            password: bcrypt.hashSync(password, Number(process.env.SALT_BCRYPT))
        }
    });
    
    return user;
}

async function createToken (user : userData) {
    const userData = await createUser(user);

    return jwt.sign({ userId: userData.id }, process.env.SECRET_JWT);
}

const authFactory = {
    createLogin,
    createUser,
    createToken
};

export default authFactory;