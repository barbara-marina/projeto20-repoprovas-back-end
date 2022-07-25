import supertest from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app.js";
import prisma from "../src/config/database.js";
import authFactory from "./factories/authFactory.js";
import { userData } from "../src/repositories/authRepository.js";

beforeEach (async () => {
    await prisma.$executeRaw`DELETE FROM users WHERE email = 'barbaramarina@mail.com'`;
});

describe ("User auth tests suite", () => {
    it ("given email and password, create user",async () => {
        const login = authFactory.createLogin();
        const response = await supertest(app).post(`/sign-up`).send(login);
        expect(response.status).toBe(201);

        const user = await prisma.user.findFirst({
            where: {
                email: login.email
            }
        });
        expect(user.email).toBe(login.email);
    });

    it ("given valid email an password, receive token", async () => {
        const login : userData = authFactory.createLogin();
        const user = authFactory.createUser(login);

        const response = await supertest(app).post(`/sign-in`).send({...login, password: "senhaErrada"});
        expect(response.statusCode).toBe(401);
    });

    it("given an invalid input, returns 422", async () => {
        const login = authFactory.createLogin();
        delete login.password;
    
        const response = await supertest(app).post(`/sign-up`).send(login);
        expect(response.status).toBe(422);
    });

    it ("given email and password already un use, fail to create user",async () => {
        const login : userData = authFactory.createLogin();
        await authFactory.createUser(login);

        const response = await supertest(app).post(`/sign-up`).send(login);
        expect(response.statusCode).toBe(409);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
})