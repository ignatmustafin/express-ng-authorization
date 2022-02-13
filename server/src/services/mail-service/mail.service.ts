import config from 'config';
import nodemailer from 'nodemailer';


class MailService {
    mailConf: any = config.get("mailConfig");
    transporter: any;
    constructor () {
        this.transporter = nodemailer.createTransport({
            host: this.mailConf.SMTP_HOST,
            port: this.mailConf.SMTP_PORT,
            secure: false,
            auth: {
                user: this.mailConf.SMTP_USER,
                pass: this.mailConf.SMTP_PASSWORD
            }
        });
    }

    async sendActivationEmail(to: any, link: any) {
        await this.transporter.sendMail({
            from: this.mailConf.SMTP_USER,
            to,
            subject: `Account activation for ${config.get("Server.ApiUrl")}`,
            text: "",
            html: 
            `
                <div>
                    <span>Welcome to Quiz Games<span>
                    <a href="${link}">${link}</a>
                </div>
            `
        });
    }

    async sendResetPasswordLink(to: any, link: any) {
        await this.transporter.sendMail({
            from: this.mailConf.SMTP_USER,
            to,
            subject: `Account activation for ${config.get("Server.ApiUrl")}`,
            text: "",
            html: 
            `
                <div>
                    <span>Reset Password for Quiz Games<span>
                    <a href="${link}">${link}</a>
                </div>
            `
        });
    }
}

export default new MailService();
