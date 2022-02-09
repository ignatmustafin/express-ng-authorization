import bcrypt from 'bcrypt';
import UserDto from '../user/user.dto';
import User from '../../models/user.model';
import tokenService from '../token/token.service';
import ApiError from '../error-service/api.errors';
import GoogleService from '../axios/google.service';

class AuthService {
    async registration(email: string, password: string, firstName: string, lastName: string) {
        const hashedPassword = await bcrypt.hash(password, 7);
        const user: any = await User.create({firstName, lastName, email, password: hashedPassword});
        const userDto = new UserDto(user);

        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {user: userDto, ...tokens};
       
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
            const user: any = await User.create({...newUser});
            const userDto = new UserDto(user);

            const tokens = tokenService.generateToken({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return {...userDto, ...tokens};
        }

        const userDto = new UserDto(user);

        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...userDto, ...tokens};
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

    async resetPassword(userId: number, oldPassword: string, newPassword: string) {
        const user: any = await User.findByPk(userId);
        const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
        
        if (!checkOldPassword) {
            throw ApiError.BadRequest("old password not valid");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 7);

        const createNewPassword = await User.update({password: hashedPassword}, {where: {id: user.id}, returning: true});
        const updatedUser = createNewPassword[1].map((users: any) => users.dataValues);
        return new UserDto(updatedUser[0]);
    }
}

export default new AuthService();