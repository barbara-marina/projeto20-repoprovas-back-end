import { Request, Response } from "express";
import errorHandler from "../middlewares/errorMiddleware.js";
import categoryRepository from "../repositories/categoryRepository.js";

async function getCategories(req: Request, res: Response) {
    const categories = await categoryRepository.findCategories();
    if (!categories) throw errorHandler.notFound("Not Found.");

    res.status(200).send(categories);
}

const categoryController = {
    getCategories
};

export default categoryController;