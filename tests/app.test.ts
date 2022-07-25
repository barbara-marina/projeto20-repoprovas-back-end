import supertest from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";
import authFactory from "./factories/authFactory.js";
import { userData } from "../src/repositories/authRepository.js";

beforeEach (async () => {
    await prisma.$executeRaw`DELETE FROM users WHERE email = 'barbaramarina@mail.com'`;
});

describe ("User auth tests suite", () => {
    it ("given valid email and password, create user",async () => {
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

        const response = await supertest(app).post(`/sign-in`).send(login);
        const token = response.body.token;
        expect(token).not.toBeNull();
    });

    it ("given invalid password, receive 401",async () => {
        const login : userData = authFactory.createLogin();

        const response = await supertest(app).post(`/sign-in`).send({...login, password: "wrongPassword"});
        expect(response.statusCode).toBe(401);
    });

    it ("given an invalid input, returns 422", async () => {
        const login = authFactory.createLogin();
        delete login.password;
    
        const response = await supertest(app).post(`/sign-up`).send(login);
        expect(response.status).toBe(422);
    });

    it ("given email and password already in use, fail to create user",async () => {
        const login : userData = authFactory.createLogin();
        await authFactory.createUser(login);

        const response = await supertest(app).post(`/sign-up`).send(login);
        expect(response.statusCode).toBe(409);
    });
});

describe("Test tests suite", () => {
    it("given a test and a valid token, create test", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React",
            "teacher": "Diego Pinho"
        };

        let response = await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it("given a invalid input and a valid token, returns 422", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React"
        };

        let response = await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(422);
    });

    it("given a invalid data and a valid token, returns 404", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React",
            "teacher": "Ana"
        };

        let response = await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(404);
    });

    it("given a valid test and a invalid token, returns 404", async () => {
        const token = "";

        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React",
            "teacher": "Diego Pinho"
        };

        let response = await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401);
    });
});

describe("'Group Tests By' tests suite", () => {
    it("given a valid query and valid token, get test", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        let response = await supertest(app).get(`/test?groupBy=teachers`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.text).not.toBeNull();
    });

    it("given a valid query and valid token, get test", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        let response = await supertest(app).get(`/test?groupBy=disciplines`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.text).not.toBeNull();
    });

    it("given a invalid query and valid token, return 422", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        let response = await supertest(app).get(`/test?groupBy=error`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(422);
    });

    it("given a valid query and invalid token, return 401", async () => {
        const login : userData = authFactory.createLogin();
        const token = "";

        let response = await supertest(app).get(`/test?groupBy=teachers`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401);
    });

});

describe("Get tests by id tests suite", () => {
    it("given a valid param and valid token, redirect to url", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);
        
        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React",
            "teacher": "Diego Pinho"
        };

        await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);

        let response = await supertest(app).get(`/test/1`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    it("given a invalid param and valid token, return 422", async () => {
        const login : userData = authFactory.createLogin();
        const token = await authFactory.createToken(login);

        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React",
            "teacher": "Diego Pinho"
        };

        await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);

        let response = await supertest(app).get(`/test/error`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(422);
    });

    it("given a valid param and invalid token, return 401", async () => {
        const login : userData = authFactory.createLogin();
        const token = "";

        const test = {
            "name": "teste",
            "pdfUrl": "https://www.google.com.br",
            "category": "Prática",
            "discipline": "React",
            "teacher": "Diego Pinho"
        };

        await supertest(app).post(`/test`).send(test).set("Authorization", `Bearer ${token}`);

        let response = await supertest(app).get(`/test/1`).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401);
    });

});

afterAll(async () => {
    await prisma.$disconnect();
})