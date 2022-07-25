import dotenv from "dotenv";
import chalk from "chalk";

import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.bold.cyanBright(`Server is up and running on port ${PORT}.`));
});