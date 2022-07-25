import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorMiddleware.js";

import authRepository, { userData } from "../repositories/authRepository.js";

async function createUser({email, password}: userData) {
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) throw errorHandler.conflict("User already exists.");

    const hashPassword = bcrypt.hashSync(password, Number(process.env.SALT_BCRYPT));
    await authRepository.insertUser({email, password: hashPassword});
}

async function getUserOrFail({email, password} : userData) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) throw errorHandler.unauthorized("User not found.");

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw errorHandler.unauthorized("Password does not match.");

    return user;    
}

async function login(user : userData) {
    const userData = await getUserOrFail(user);

    return jwt.sign({ userId: userData.id }, process.env.SECRET_JWT);
}


const authService = {
    createUser,
    login,
};

export default authService;