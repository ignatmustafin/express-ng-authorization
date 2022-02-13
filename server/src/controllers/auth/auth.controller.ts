import express from 'express';
import sequelize from '../../db.connect';
import authService from '../../services/auth/auth.service';

export default class AuthController {

    async registration(req: express.Request, res: express.Response, next: express.NextFunction) {
        const transaction: any = await sequelize.transaction();

        try {
            const {firstName, lastName, email, password} = req.body;
            const userData = await authService.registration(email, password, firstName, lastName, transaction) as any;

            await transaction.commit();
            res.status(201).json({success: true, data: userData});
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    async activate(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {link} = req.query;
            await authService.activate(link);
            return res.status(200);
        } catch (error) {
            next(error);
        }
    }

    async signIn(req: express.Request, res: express.Response, next: express.NextFunction) {
        const transaction: any = await sequelize.transaction();

        try {
            const {email, password} = req.body;
            const userData = await authService.signIn(email, password, transaction);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            await transaction.commit();
            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    async signInWithGoogle(req: express.Request, res: express.Response, next: express.NextFunction) {
        const transaction: any = await sequelize.transaction();

        try {
            const userData = await authService.signInWithGoogle(req.body.code, transaction);
            await transaction.commit();
            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    async signInWithFacebook(req: express.Request, res: express.Response, next: express.NextFunction) {
        const transaction: any = await sequelize.transaction();

        try {
            const userData = await authService.signInWithFacebook(req.body.code, transaction);

            await transaction.commit();
            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    async signOut(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const token = await authService.signOut(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json({success: true, token});
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const transaction: any = await sequelize.transaction();

        try {
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken, transaction);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            await transaction.commit();
            return res.status(201).json({success: true, data: userData});
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    async getResetPasswordLink(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const {email} = req.body;
            await authService.getResetPasswordLink(email);

            return res.status(200).json({success: true, message: `check your email`});
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
        const transaction: any = await sequelize.transaction();

        try {
            const {newPassword} = req.body;
            const {link} = req.params;
            const id: any = req.query.id;
            const userData = await authService.resetPassword(id, newPassword, link, transaction);

            await transaction.commit();
            return res.status(200).json({success: true, data: userData});
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
}