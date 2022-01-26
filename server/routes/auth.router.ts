import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router()

const auth = new authController()

router.post('/registration', auth.userRegistration)

export default router;