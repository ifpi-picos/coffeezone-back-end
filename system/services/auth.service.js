const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto-js')

module.exports = class AuthService {
    constructor(app) {
        this.app = app

        return {
            name: "auth",
            functions: {
                comparePassword: this.comparePassword,
                createToken: this.createToken,
                verifyToken: this.verifyToken,
                createRecoveryToken: this.createRecoveryToken
            }
        }
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }

    createToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            preferences: user.preferences,
            type: user.type,
        }

        let token = jwt.sign(payload, process.env.JWT_KEY) 

        token = crypto.AES.encrypt(token, process.env.AES_KEY).toString()
        return token
    }

    verifyToken(token) {
        token = crypto.AES.decrypt(token, process.env.AES_KEY).toString(crypto.enc.Utf8)
        return jwt.verify(token, process.env.JWT_KEY)
    }

    createRecoveryToken(user) {
        const payload = {
            id: user.id,
            email: user.email
        }

        let token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' })        
        token = crypto.AES.encrypt(token, process.env.AES_KEY).toString()
        
        return token
    }
}