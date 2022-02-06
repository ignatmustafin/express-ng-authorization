import { Router } from "express";
import AuthController from "../../controllers/auth.controller";
import authValidation from "../../middlewares/auth-validation.mdw";
import validations from "../../services/auth.validation.service";
const router = Router();

const auth = new AuthController();

router.post('/registration', authValidation(validations.registrationValidators), auth.userRegistration);
router.post('/signIn', authValidation(validations.signInValidation), auth.userLogIn);
router.post('/refreshToken', auth.tokenRefresh);
router.delete('/logOut', auth.userLogOut);

export default router;