import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import tokenMiddleware from "../middlewares/tokenMiddleware.js";

const categoryRouter = Router();

categoryRouter.get("/categories", tokenMiddleware, categoryController.getCategories);

export default categoryRouter;