import nodemailer from 'nodemailer'
import redefineEmail from './emails/redefine.html'
import actionRegEmail from './emails/actionReg.html'

class Mailer {
    mailer: nodemailer.Transporter
    emails: {
        actionReg: string,
        redefine: string
    }
    constructor() {
        this.mailer = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        this.emails = {
            redefine: redefineEmail,
            actionReg: actionRegEmail
        }
    }

    async sendRecoveryEmail(user: User, token: string): Promise<any> {
        let email = this.emails.redefine
        email = email.split(/\$username\$/gm).join(user.name.trim().split(' ')[0])
        email = email.split(/\$link\$/gm).join(`${process.env.CORS_ORIGIN}recovery?code=${token}`)

        let mailInfo = new Promise((resolve, reject): any => {
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

    async sendActionRegisteredEmail(user: User, action: any): Promise<any> {
        let email = this.emails.actionReg
        email = email.split(/\$username\$/gm).join(user.name.trim().split(' ')[0])
        email = email.split(/\$time\$/gm).join(`${action.newActionDateTime.day} às ${action.newActionDateTime.time}`)
        email = email.split(/\$action\$/gm).join(action.action)

        let mailInfo = new Promise((resolve, reject): any => {
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

const mailer = new Mailer()
export default mailer