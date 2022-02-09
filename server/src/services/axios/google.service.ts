import config from 'config';
import axios from 'axios';

class GoogleService {
    googleService: any = config.get("googleService");

    async getToken (code: string) {
        const config: object = {
            url: this.googleService.token_url,
            method: "post",
            data: {
                client_id: this.googleService.client_id,
                client_secret: this.googleService.client_secret,
                redirect_uri: this.googleService.redirect_uri,
                grant_type: "authorization_code",
                code
            }
        };
        return axios(config);
    }

    async getUserData(accessToken: string) {
        const config: object = {
            url: this.googleService.userInfo_url,
            method: "get",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        return axios(config);
    } 
}

export default new GoogleService();