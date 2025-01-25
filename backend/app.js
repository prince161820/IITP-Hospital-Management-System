import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
const app = express();
import messageRouter from "./router/messageRouter.js"
config({ path: "./config.env" });
import {errorMiddleware}from './middlewares/errorMiddleware.js'
import userRouter from "./router/userRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"

app.use(
  cors({
    origin: [process.env.FRONTEND_URI, process.env.DASHBOARD_URI],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/appointment", appointmentRouter )
dbConnection();
app.use(errorMiddleware);
export default app;
