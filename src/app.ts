import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import UserRoutes from "./routes/UserRoutes";
import TaskRoutes from "./routes/TaskRoutes";
import ErrorController from "./controllers/ErrorController";

dotenv.config({ path: "src/config.env" });

const app: express.Application = express();
console.log(process.env.JWT_SECRET);
app.use(cors());

app.use(express.json());

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/tasks", TaskRoutes);

app.use(ErrorController);

export default app;
