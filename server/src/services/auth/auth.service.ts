import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import config from 'config';

import UserDto from '../user/user.dto';
import User from '../../models/user.model';
import Activations from '../../models/activation.model';

import tokenService from '../token/token.service';
import GoogleService from '../axios/google.service';
import FacebookService from "../axios/facebook.service";
import mailService from '../mail-service/mail.service';
import ApiError from '../error-service/api.errors';
import { activationsUtils, tokenUtils } from '../../utils';

class AuthService {
    async registration(email: string, password: string, firstName: string, lastName: string, transaction: any) {
        const hashedPassword = await bcrypt.hash(password, 7);
        const user: any = await User.create(
            {firstName, lastName, email, password: hashedPassword},
            {transaction}
        );
        const userDto = new UserDto(user);

        const activationLink = uuidv4();
        const uniqueLink = `${config.get("clientUrl.activationRedirect")}&link=${activationLink}`;

        const saveActivationLink = await Activations.create({
            activationLink,
            user_id: userDto.id
        }, {transaction});

        if (!saveActivationLink) {
            throw ApiError.BadRequest("Some problems with activation link, try again later");
        }

        await mailService.sendActivationEmail(email, uniqueLink);

        const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)

        return {user: userDto, ...tokens};
    }

    async activate(activationLink: string) {
        const changeIsActivatedValue: any = await Activations.update(
            {isActivated: true},
            {where: {activation_link: activationLink}, returning: true}
        );

        if (changeIsActivatedValue[0] === 0) {
            throw ApiError.BadRequest("404 NOT FOUND");
        }

        return changeIsActivatedValue;
    }

    async signIn(email: string, password: string, transaction: any) {
        const user: any = await User.findOne({
            where: {email}, raw: true,
            include: {
                model: Activations,
                as: "isActivated",
                required: true,
                attributes: ["is_activated"],
            }
        });

        if (!user) {
            throw ApiError.BadRequest("Incorrect email or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw ApiError.BadRequest("Incorrect email or password");
        }

        const userActivated = user['isActivated.is_activated'];

        if (!userActivated) {
            throw ApiError.BadRequest("Account is not activated");
        }

        const userDto = new UserDto(user);
        const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)
      
        return {...userDto, ...tokens};
    }

    async signInWithGoogle(code: string, transaction: any) {
        const tokensData: any = await GoogleService.getToken(code);
        const userData: any = await GoogleService.getUserData(tokensData.data.access_token);
        const user: any = await User.findOne({where: {email: userData.data.email}});

        if (!user) {
            const newUser = {
                firstName: userData.data.given_name,
                lastName: userData.data.family_name,
                email: userData.data.email,
                googleRegistration: true
            };

            const user: any = await User.create({...newUser}, {transaction});
            const userDto = new UserDto(user);

            const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)

            return {...userDto, ...tokens};
        }

        const userDto = new UserDto(user);

        const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)


        return {...userDto, ...tokens};
    }

    async signInWithFacebook(code: string, transaction: any) {
        const tokensData: any = await FacebookService.getToken(code);
        const userData: any = await FacebookService.getUserData(tokensData.data.access_token);
        const user: any = await User.findOne({where: {email: userData.data.email}});

        if (!user) {
            const newUser = {
                firstName: userData.data.first_name,
                lastName: userData.data.last_name,
                email: userData.data.email,
                googleRegistration: true
            };

            const user: any = await User.create({...newUser}, {transaction});
            const userDto = new UserDto(user);

            const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)


            return {...userDto, ...tokens};
        }

        const userDto = new UserDto(user);

        const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)

        return {...userDto, ...tokens};
    }

    async signOut(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);

        if (token) {
            return token;
        }

        throw ApiError.BadRequest("not signed in");
    }

    async refresh(refreshToken: string, transaction: any) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData: any = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findTokenInDb(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id);
        const userDto = new UserDto(user);

        const tokens = await tokenUtils.generateAndSaveTokens({...userDto}, transaction)

        return {user: userDto, ...tokens};
    }

    async getResetPasswordLink(email: any) {
        const user: any = await User.findOne({where: {email}});

        if (!user) {
            throw ApiError.BadRequest("There is no user with this email");
        }

        const resetPasswordLink = uuidv4();
        const uniqueLink = `${config.get("clientUrl.resetPasswordRedirect")}?link=${resetPasswordLink}&id=${user.id}`;
        const updateLinkForUser = await Activations.update({activationLink: resetPasswordLink},
            {
                where: {user_id: user.id},
                returning: true
            }
        );

        if (updateLinkForUser[0] === 0) {
            throw ApiError.BadRequest("some problems with reset password link, try again later");
        }

        await mailService.sendResetPasswordLink(user.email, uniqueLink);

        return updateLinkForUser;
    }

    async resetPassword(userId: number, newPassword: string, link: any, transaction: any) {
        const user: any = await User.findByPk(userId, {transaction});

        const checkIfLinkActive = await Activations.findOne({
            where: {activation_link: link, user_id: user.id},
            transaction
        });

        if (!checkIfLinkActive) {
            throw ApiError.BadRequest("Link is not active");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 7);
        const createNewPassword = await User.update({password: hashedPassword}, {
            where: {id: user.id},
            returning: true,
            transaction
        });

        const updatedUser = createNewPassword[1].map((users: any) => users.dataValues);

        await activationsUtils.clearActivationLink(user.id, transaction)

        return new UserDto(updatedUser[0]);
    }
}

export default new AuthService();