import joi from "joi";
import { newTest } from "../services/testService.js";

const testSchema = joi.object<newTest>({
    name: joi.string().required(),
    pdfUrl: joi.string().uri().required(),
    category: joi.string().required(),
    discipline: joi.string().required(),
    teacher: joi.string().required()
});

export default testSchema;