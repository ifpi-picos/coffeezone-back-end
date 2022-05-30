const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')

module.exports = class Mailer {
    constructor() {
        this.mailer = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        this.emails = {
            redefine: fs.readFileSync(path.join(__dirname, 'email.html'), 'utf8')
        }
    }

    async sendRecoveryEmail(user, token) {
        let email = this.emails.redefine
        email = email.split(/\$username\$/gm).join(user.name.trim().split(' ')[0])
        email = email.split(/\$link\$/gm).join(`${process.env.CORS_ORIGIN}recovery?code=${token}`)

        let mailInfo = new Promise((resolve, reject) => {
            this.mailer.sendMail({
                from: 'coffee-zone@hotmail.com',
                to: user.email,
                subject: 'Coffee Zone - Redefinir Senha',
                html: email
            }, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })

        return await mailInfo
    }
}