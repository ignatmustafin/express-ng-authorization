import jwt from 'jsonwebtoken';
import config from 'config';
import Token from '../models/token.model';
import ApiError from '../exceptions/api.errors';

class TokenService {
    generateToken (payload: any) {

        const accessToken =  jwt.sign(payload, config.get("token.jwt"), {expiresIn: "24h"});
        const refreshToken =  jwt.sign(payload, config.get("token.jwtRefresh"), {expiresIn: "30d"});
        return {
            accessToken,
            refreshToken
        };
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, config.get("token.jwt"));
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, config.get("token.jwtRefresh"));
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData: any = await Token.findOne({where: {user_id: userId}});
        if (tokenData) {
            console.log("REFRESHED");
            console.log(refreshToken);
            const tokenWasRefreshed = await Token.update({refreshToken}, {where: {user_id: userId}});
            console.log(tokenWasRefreshed);
            return tokenWasRefreshed;
        }
        
        const createToken = await Token.create({user_id: userId, refreshToken});
        return createToken;
    }

    async removeToken(refreshToken: string) {
        const tokenData = await Token.destroy({where: {refresh_token: refreshToken}});
        if(tokenData !== 0) {
            return refreshToken;
        } 
        return;       
    }

    async findTokenInDb(refreshToken: string) {
        const tokenData = await Token.findOne({where: {refresh_token: refreshToken}});
        return tokenData;     
    }
}

export default new TokenService();
