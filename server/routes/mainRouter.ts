import { Router } from "express";
import AuthRouter from "./routers/auth.router";
const mainRouter = Router();

mainRouter.use('/auth', AuthRouter);

export default mainRouter;