import joi from "joi";
import { userData } from "../repositories/authRepository.js";

const authSchema = joi.object< userData >({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export default authSchema;