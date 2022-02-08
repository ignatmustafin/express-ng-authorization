import {Router} from "express";
import AuthController from "../../controllers/auth/auth.controller";
import authValidation from "../../middlewares/auth-validation.middleware";
import validations from "../../services/validators/user-validation.service";

const router = Router();
const auth = new AuthController();

router.post('/registration', authValidation(validations.registrationValidators), auth.registration);
router.post('/reset-password')
router.post('/signIn', authValidation(validations.signInValidation), auth.signIn);
router.post('/signInWithGoogle', auth.signInWithGoogle)
router.post('/refreshToken', auth.tokenRefresh);
router.delete('/signOut', auth.signOut);

export default router;