import express from 'express';
import {validationResult, ValidationChain} from 'express-validator';
import { ApiError } from '../services';

export default function authValidation(validations: ValidationChain[]) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.method === "OPTIONS") {
            next();
        }

        for (const validation of validations) {
            const result: any = await validation.run(req);

            if (result.errors.length) {
                break;
            }
        }

        const errors = validationResult(req) as any;

        if (errors.isEmpty()) {
            return next();
        }

        return next(ApiError.BadRequest("Validation error", errors.errors[0].msg));
    };
}