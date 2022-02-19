import tokenService from "../../services/token/token.service";

class TokenUtils {

    async generateAndSaveTokens(userDto: any, transaction: any) {

        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken, transaction);

        return {...tokens}
    }
}

export default new TokenUtils()
