import jwt from 'jsonwebtoken';
import config from 'config';

class TokenService {
    generateAccessToken (id: number) {
        const payload = {
            id
        };
        return jwt.sign(payload, config.get("jwt"), {expiresIn: "24h"});
    }
}

export default new TokenService();
