import  express  from 'express';
import User from "../models/user.model";
import bcrypt from 'bcrypt';
import TokenService from '../services/token.service';
export default class AuthController {

    async userRegistration(req: express.Request, res: express.Response) {
        try {

            const { firstName, lastName, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 7);

            const user: any = await User.create({ firstName, lastName, email, password: hashedPassword});
    
            res.status(201).json({success: true, data: `user with id ${user.dataValues.id} created successfully`});
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, error});
        }
    }

    async userLogIn(req: express.Request, res: express.Response) {
        try {
            const {email, password} = req.body;

            const user: any = await User.findOne({where: {email}});

            console.log(user);

            if (!user) {
                return res.status(400).json({success: false, error: `user with email "${email}" is not exist`});
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({success: false, error: "wrong password"});
            }

            const token = TokenService.generateAccessToken(user._id);
            return res.status(200).json({success: true, user: {id: user.id, token: `Bearer ${token}`}});

        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, error});
        }
    }
}