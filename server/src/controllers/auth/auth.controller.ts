import express from 'express';
import ApiError from '../../services/error-service/api.errors';
import authService from '../../services/auth/auth.service';

export default class AuthController {

    async registration(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {firstName, lastName, email, password} = req.body;

            const userData = await authService.registration(email, password, firstName, lastName) as any;

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            res.status(201).json({success: true, data: userData});
        } catch (error) {
            next(error);
        }
    }

    async signIn(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {email, password} = req.body;
            const userData = await authService.signIn(email, password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            next(error);
        }
    }

    async signInWithGoogle(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const userData = await authService.signInWithGoogle(req.body.code);
            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            next(error);
        }
    }

    async signOut(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                throw ApiError.BadRequest("not signed in");
            }
            const token = await authService.signOut(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json({success: true, token});
        } catch (error) {
            next(error);
        }
    }

    async tokenRefresh(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {refreshToken} = req.cookies;

            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {userId, oldPassword, newPassword} = req.body;
            const userData = await authService.resetPassword(userId, oldPassword, newPassword);
            
            return res.status(200).json({success: true, data: userData});
        } catch (error) {
            next(error);
        }
    }
}