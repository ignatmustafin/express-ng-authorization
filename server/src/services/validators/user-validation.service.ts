import {check} from "express-validator";
import User from "../../models/user.model";
import ApiError from "../error-service/api.errors";

export default {
    registrationValidators:
        [
            check('firstName')
                .trim().notEmpty().withMessage("first name is required"),
            check('lastName')
                .trim().notEmpty().withMessage("last name is required"),
            check('email')
                .trim().notEmpty().withMessage("email is required")
                .normalizeEmail().withMessage("wrong email")
                .isEmail().withMessage("wrong email")
                .custom(async (value) => {
                    const candidate = await User.findOne({where: {email: value}});

                    if (candidate) {
                        throw ApiError.BadRequest("email already in use");
                    }
                }),
            check('password')
                .isLength({min: 6}).withMessage("password too short")
                .not().matches(/[#$%^&\\/"'@ _]/g).withMessage("password must contain only letters and numbers"),
            check('passwordConfirmation')
                .custom((value, {req}) => value === req.body.password)
        ],
    signInValidation:
        [
            check('email')
                .trim().notEmpty().withMessage("email is required")
                .normalizeEmail().withMessage("wrong email")
                .isEmail().withMessage("wrong email"),
            check('password').isLength({min: 6}).withMessage("wrong password")
                .not().matches(/[#$%^&\\/"'@ _]/g).withMessage("wrong password"),
        ],
    resetPasswordValidator: 
        [
            check('oldPassword')
                .isLength({min: 6}).withMessage("wrong old password")
                .not().matches(/[#$%^&\\/"'@ _]/g).withMessage("wrong old password"),
            check('newPassword')
                .isLength({min: 6}).withMessage("wrong new password")
                .not().matches(/[#$%^&\\/"'@ _]/g).withMessage("wrong new password"),
            check('passwordConfirmation')
                .custom((value, {req}) => value === req.body.newPassword)
        ]
    
};
