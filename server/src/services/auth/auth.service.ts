import bcrypt from 'bcrypt';
import UserDto from '../user/user.dto';
import User from '../../models/user.model';
import tokenService from '../token/token.service';
import ApiError from '../error-service/api.errors';

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