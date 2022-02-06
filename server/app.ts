import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from "config";
import mainRouter from "./routes/mainRouter";
import { checkDbConnection } from "./data_base/db.connect";
import errorMiddleware from "./middlewares/errors.mdw";

const app = express();
const PORT = config.get("Server.PORT") || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", mainRouter);

app.use(errorMiddleware);


async function connectToDbBeforeServerStarted() {
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