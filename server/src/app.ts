import express from "express";
import config from "config";

import cookieParser from 'cookie-parser';
import cors from 'cors';

import {checkDbConnection} from "./db.connect";
import errorMiddleware from "./middlewares/errors.middleware";
import mainRouter from "./routes/main-router";

const app = express();
const PORT = config.get("Server.PORT") || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", mainRouter);
app.use(errorMiddleware);

const connectToDbBeforeServerStarted = async () => {
    try {
        await checkDbConnection();
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        });

    } catch (error) {
        return error;
    }
}

connectToDbBeforeServerStarted();