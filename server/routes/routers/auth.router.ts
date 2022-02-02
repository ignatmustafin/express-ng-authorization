import { Router } from "express";
import AuthController from "../../controllers/auth.controller";
import authValidation from "../../middlewares/auth-validation.mdw";
import Token from "../../models/token.model";
import validations from "../../services/auth.validation.service";
const router = Router();

const auth = new AuthController();

router.post('/registration', authValidation(validations.registrationValidators), auth.userRegistration);
router.post('/signIn', authValidation(validations.signInValidation), auth.userLogIn);
router.get('/qwe', async (req:any, res: any) => {
    const qwe = await Token.findAll();
    console.log(qwe);
    res.send(qwe);
});
export default router;