import { Request, Response } from "express";
import errorHandler from "../middlewares/errorMiddleware.js";
import testService from "../services/testService.js";

async function createTest(req: Request, res: Response) {
    const test = req.body;
    await testService.createTest(test);
    
    res.sendStatus(200);
}

async function getTestBy(req: Request, res: Response) {
    const { groupBy } = req.query
    if (groupBy === "teachers") {
        const result = await testService.getTestsByTeachers();
        res.status(200).send(result);
    } else if (groupBy === "disciplines") {
        const result = await testService.getTestsByDisciplines();
        res.status(200).send(result);
    } else {
        throw errorHandler.unprocessableEntity("Unprocessable entity.");
    }
}

async function getTestById(req: Request, res: Response) {
    const { id } = req.params;

    if (!Number(id)) throw errorHandler.unprocessableEntity("Is not a number");

    const test = await testService.getTestsById(Number(id));

    res.redirect(200, test.pdfUrl);    
}

const testController = {
    createTest, 
    getTestBy,
    getTestById
};

export default testController;