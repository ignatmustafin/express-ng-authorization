import jwt from 'jsonwebtoken';
import config from 'config';
import Token from '../models/token.model';

class TokenService {
    generateToken (payload: any) {

        const accessToken =  jwt.sign(payload, config.get("token.jwt"), {expiresIn: "24h"});
        const refreshToken =  jwt.sign(payload, config.get("token.jwtRefresh"), {expiresIn: "30d"});
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData: any = await Token.findOne({where: {user_id: userId}});
        if (tokenData) {
            const updateToken = {refresh_token: refreshToken};
            const tokenWasRefreshed = await Token.update(updateToken, {where: {user_id: userId}});
            return tokenWasRefreshed;
        }
        
        const createToken = await Token.create({user_id: userId, refresh_token: refreshToken});
        return createToken;
    }
}

export default new TokenService();
