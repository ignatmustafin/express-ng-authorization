import bcrypt from 'bcrypt';
import UserDto from '../user/user.dto';
import User from '../../models/user.model';
import tokenService from '../token/token.service';
import ApiError from '../error-service/api.errors';
import axios from "axios";
import config from "config";

class AuthService {
    async registration(email: string, password: string, firstName: string, lastName: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 7);
            const user: any = await User.create({firstName, lastName, email, password: hashedPassword});
            const userDto = new UserDto(user);

            const tokens = tokenService.generateToken({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {user: userDto, ...tokens};
        } catch (error) {
            throw error;
        }
    }

    async signIn(email: string, password: string) {
        const user: any = await User.findOne({where: {email}});

        if (!user) {
            throw ApiError.BadRequest("Wrong email or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw ApiError.BadRequest("Email or password not valid");
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...userDto, ...tokens};
    }

    async signInWithGoogle(code: string) {
        const tokensData = await axios({
            url: config.get('googleService.token_url'),
            method: 'post',
            data: {
                client_id: config.get('googleService.client_id'),
                client_secret: config.get('googleService.client_secret'),
                redirect_uri: config.get('googleService.redirect_uri'),
                grant_type: 'authorization_code',
                code,
            },
        });

        const userData = await axios({
            url: config.get('googleService.userInfo_url'),
            method: 'get',
            headers: {
                Authorization: `Bearer ${tokensData.data.access_token}`,
            },
        });

        const user: any = await User.findOne({where: {email: userData.data.email}});

        if (!user) {
            const newUser = {
                firstName: userData.data.given_name,
                lastName: userData.data.family_name,
                email: userData.data.email,
                password: '123456'
            }
            const hashedPassword = await bcrypt.hash(newUser.password, 7);
            const user: any = await User.create({...newUser, password: hashedPassword});
            await new UserDto(user);
        }

        const newUser: any = await User.findOne({where: {email: userData.data.email}});
        const createdUser = await new UserDto(newUser);
        const tokens = tokenService.generateToken({...createdUser});


        console.log('777777777777777777777777777777777777', tokens, createdUser)
        await tokenService.saveToken(createdUser.id, tokens.refreshToken);
        console.log('88888888888888888888888888888888888', tokens, createdUser)
        return {...createdUser, ...tokens};
    }

    /**
     * TODO
     * @param refreshToken
     */
    async signOut(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        if (token) {
            return token;
        }

        throw ApiError.BadRequest("not signed in");
    }

    /**
     * TODO
     * @param refreshToken
     */
    async refresh(refreshToken: string) {
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
        const tokens = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {user: userDto, ...tokens};
    }
}

export default new AuthService();