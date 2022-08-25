import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto-js'

export default class AuthServices {
    constructor() { }

    comparePassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash)
    }

    createToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            preferences: user.preferences,
            type: user.type,
        }

        let token = jwt.sign(payload, `${process.env.JWT_KEY}`)

        token = crypto.AES.encrypt(token, `${process.env.AES_KEY}`).toString()
        return token
    }

    verifyToken(token: string) {
        token = crypto.AES.decrypt(token, `${process.env.AES_KEY}`).toString(crypto.enc.Utf8)
        const payload = jwt.verify(token, `${process.env.JWT_KEY}`)
        if (typeof payload != 'string') {
            return payload
        }
        else {
            return false
        }
    }

    createRecoveryToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email
        }

        let token = jwt.sign(payload, `${process.env.JWT_KEY}`, { expiresIn: '1h' })
        token = crypto.AES.encrypt(token, `${process.env.AES_KEY}`).toString()

        return token
    }
}