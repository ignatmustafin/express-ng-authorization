import jwt from 'jsonwebtoken';
import config from 'config';
import Token from '../../models/token.model';

class TokenService {
    generateToken(payload: any) {
        const accessToken = jwt.sign(payload, config.get("token.jwt"), {expiresIn: "24h"});
        const refreshToken = jwt.sign(payload, config.get("token.jwtRefresh"), {expiresIn: "30d"});

        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token: string) {
        try {
            return jwt.verify(token, config.get("token.jwt"));
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            return jwt.verify(token, config.get("token.jwtRefresh"));
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId: number, refreshToken: string, transaction: any) {
        const tokenData: any = await Token.findOne({where: {user_id: userId}, transaction});
        if (tokenData) {
            return await Token.update({refreshToken}, {where: {user_id: userId}, transaction});
        }

        return await Token.create({user_id: userId, refreshToken}, {transaction});
    }

    async removeToken(refreshToken: string) {
        const tokenData = await Token.destroy({where: {refresh_token: refreshToken}});

        if (tokenData !== 0) {
            return refreshToken;
        }
        return;
    }

    async findTokenInDb(refreshToken: string) {
        return await Token.findOne({where: {refresh_token: refreshToken}});
    }
}

export default new TokenService();
