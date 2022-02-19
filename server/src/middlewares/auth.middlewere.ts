import express from 'express';
import { ApiError, tokenService } from '../services';

export default function(req: any, res: express.Response, next: express.NextFunction) {
    try {
        const authorizationHeader: any = req.headers.authoruzation;

        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if(!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if(!userData) {
            return next(ApiError.UnauthorizedError());
        }
      
        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}