import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker"
import prisma from "../../src/config/database.js";
import { userData } from "../../src/repositories/authRepository.js";

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
    
    return {email, password};
}

const authFactory = {
    createLogin,
    createUser,
};

export default authFactory;