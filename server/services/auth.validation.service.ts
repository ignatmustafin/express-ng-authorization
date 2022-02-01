import { check } from "express-validator";
import User from "../models/user.model";


export  default {
    registrationValidators: 
        [
            check('firstName')
            .trim()
            .notEmpty()
            .withMessage("first name is required field"),
            check('lastName')
            .trim()
            .notEmpty()
            .withMessage("last name is required field"),
            check('email')
            .trim()
            .notEmpty()
            .withMessage("email is required field")
            .normalizeEmail()
            .withMessage("wrong type of email field")
            .isEmail()
            .withMessage("wrong type of email field")
            .custom(async (value) => {
                const candidate = await User.findOne({where: {email: value}});
                if (candidate) {
                    throw new Error("email already in use");
                }
            }),
            check('password')
            .isLength({min: 6})
            .withMessage("password must be at least 6 characters long")
            .not().matches(/[#$%^&\\/"'@ _]/g)
            .withMessage("password must contain only letters and numbers"),
            check('passwordConfirmation')
            .custom((value, { req }) => value === req.body.password)
        ],
    signInValidation: 
    [
        check('email')
        .trim()
        .notEmpty()
        .withMessage("email is required field")
        .normalizeEmail()
        .withMessage("wrong type of email field")
        .isEmail()
        .withMessage("wrong type of email field"),
        check('password')
        .isLength({min: 6})
        .withMessage("wrong password")
        .not().matches(/[#$%^&\\/"'@ _]/g)
        .withMessage("wrong password"),
    ]
};
