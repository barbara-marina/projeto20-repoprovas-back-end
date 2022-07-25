import { Request, Response } from "express";
import { userData } from "../repositories/authRepository.js";
import authService from "../services/authService.js";

async function signUp(req: Request, res: Response) {
    const user: userData = req.body;
    await authService.createUser(user);
    
    res.sendStatus(201);
}

async function signIn(req: Request, res: Response) {
    const user: userData = req.body;
    const token = await authService.login(user);
        
    res.status(200).send(token);
}

const authController = {
    signUp,
    signIn
};

export default authController;