import { Router } from "express";
import testController from "../controllers/testController.js";
import tokenMiddleware from "../middlewares/tokenMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchema.js";
import testSchema from "../schemas/testSchema.js";

const testRouter = Router();

testRouter.post("/test", validateSchemaMiddleware(testSchema), tokenMiddleware, testController.createTest);
testRouter.get("/test", tokenMiddleware, testController.getTestBy);
testRouter.get("/test/:id", tokenMiddleware, testController.getTestById);
testRouter.get("/test/discipline/:discipline", tokenMiddleware, testController.searchTestsByDiscipline);
testRouter.get("/test/teacher/:teacher", tokenMiddleware, testController.searchTestsByTeacher);

export default testRouter;