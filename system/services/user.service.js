const crypto = require('bcrypt')

module.exports = class UserService {
    constructor(app) {
        this.app = app

        return {
            name: "user",
            functions: {
                hashPassword: this.hashPassword,
            }
        }
    }

    hashPassword(password) {
        return crypto.hashSync(password, 10)
    }
}