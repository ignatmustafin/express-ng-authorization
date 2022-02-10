export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    google: {
        google_client_id: '420466401957-pufrq5pcbmffhk9otepn95gardvj8kgb.apps.googleusercontent.com',
        google_redirect_url: 'http://localhost:4200/auth/login',
        google_auth_url: 'https://accounts.google.com/o/oauth2/v2/auth'
    },
    facebook: {
        facebook_client_id: '462840802180153',
        facebook_redirect_url: 'http://localhost:4200/auth/login',
        facebook_auth_url: 'https://www.facebook.com/v13.0/dialog/oauth'
    }
};
