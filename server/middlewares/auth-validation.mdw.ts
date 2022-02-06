import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export default function authValidation(validations: ValidationChain[]) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.method === "OPTIONS") {
            next();
        }

        for(const validation of validations) {
            const result: any = await validation.run(req);
            if(result.errors.length) break;
        }
        const errors = validationResult(req) as any;
        console.log(errors)
        if(errors.isEmpty()) {
            return next();
        }
        console.log(111)
        res.status(400).json({success: false, error: errors.errors[0].msg});
    };
}