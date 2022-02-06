import express from 'express';
import User from "../models/user.model";
import bcrypt from 'bcrypt';
import TokenService from '../services/token.service';

export default class AuthController {

    async userRegistration(req: express.Request, res: express.Response) {
        try {
            console.log(1111)
            const {firstName, lastName, email, password} = req.body;
            console.log(req.body)
            const hashedPassword = await bcrypt.hash(password, 7);
            console.log(hashedPassword)
            const user: any = await User.create({firstName, lastName, email, password: hashedPassword});

            const payload = {
                id: user.dataValues.id
            };

            const tokens = TokenService.generateToken(payload);

            await TokenService.saveToken(user.dataValues.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            res.status(201).json({success: true, data: {...tokens}});
        } catch (error) {
            return res.status(500).json({success: false, error});
        }
    }

    async userLogIn(req: express.Request, res: express.Response) {
        try {
            const {email, password} = req.body;

            const user: any = await User.findOne({where: {email}});
            console.log(req.body)
            if (!user) {
                return res.status(400).json({success: false, error: `user with email "${email}" is not exist`});
            }

            const validPassword = await bcrypt.compare(password, user.password);
            console.log(validPassword)
            if (!validPassword) {
                return res.status(400).json({success: false, error: "wrong password"});
            }

            const payload = {id: user.id};

            const tokens = TokenService.generateToken(payload);

            await TokenService.saveToken(user.id, tokens.refreshToken);
            return res.status(200).json({success: true, user: {id: user.id, token: `Bearer ${tokens.accessToken}`}});

        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, error});
        }
    }
}