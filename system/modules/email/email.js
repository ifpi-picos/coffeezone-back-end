const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')
const time = require('luxon').DateTime

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
            redefine: fs.readFileSync(path.join(__dirname, 'recovery.html'), 'utf8'),
            actionReg: fs.readFileSync(path.join(__dirname, 'actionReg.html'), 'utf8')
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

    async sendActionRegisteredEmail(user, action) {
        let email = this.emails.actionReg
        email = email.split(/\$username\$/gm).join(user.name.trim().split(' ')[0])
        email = email.split(/\$time\$/gm).join(`${action.newActionDateTime.day} às ${action.newActionDateTime.time}`)
        email = email.split(/\$action\$/gm).join(action.action)

        let mailInfo = new Promise((resolve, reject) => {
            this.mailer.sendMail({
                from: 'coffee-zone@hotmail.com',
                to: user.email,
                subject: `Coffee Zone - ${action.action} Registrada`,
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