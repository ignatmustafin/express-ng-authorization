import config from 'config';
import axios from 'axios';

class FacebookService {
    facebookService: any = config.get("facebookService");

    async getToken (code: string) {
        const config: object = {
            url: this.facebookService.token_url,
            method: "get",
            params: {
                client_id: this.facebookService.client_id,
                client_secret: this.facebookService.client_secret,
                redirect_uri: this.facebookService.redirect_uri,
                code
            }
        };

        return axios(config);
    }

    async getUserData(accessToken: string) {
        const config: object = {
            url: this.facebookService.userInfo_url,
            method: "get",
            params: {
                fields: ['id', 'email', 'first_name', 'last_name'].join(','),
                access_token: accessToken
            }
        };

        return axios(config);
    }
}

export default new FacebookService();