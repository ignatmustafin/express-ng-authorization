import {Router} from "express";
import { AuthController } from "../../controllers";
import authValidation from "../../middlewares/auth-validation.middleware";
import validations from "../../services/validators/user-validation.service";

const router = Router();
const auth = new AuthController();

router.post('/registration', authValidation(validations.registrationValidators), auth.registration);
router.get('/activate', auth.activate);

router.post('/signIn', authValidation(validations.signInValidation), auth.signIn);
router.post('/signInWithGoogle', auth.signInWithGoogle);
router.post('/signInWithFacebook', auth.signInWithFacebook);

router.post('/getResetLink', auth.getResetPasswordLink);
router.post('/resetPassword', authValidation(validations.resetPasswordValidator), auth.resetPassword);

router.post('/signOut', auth.signOut);
router.post('/refreshToken', auth.refreshToken);

export default router;