import express, {json} from "express";
import "express-async-errors";
import cors from "cors";

import router from "./routes/index.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandler.errorHandlerMiddleware);

export default app;