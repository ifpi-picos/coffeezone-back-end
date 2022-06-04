const crypto = require('bcrypt')
let db
const userType = ['Coordinator', 'Member', 'Visitor']

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class DuplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicationError";
    }
}

module.exports = class UserService {
    constructor(app) {
        db = app.db

        return {
            name: "user",
            functions: {
                hashPassword: this.hashPassword,
                validateNewUser: this.validateNewUser,
                verifyDuplicate: this.verifyDuplicate,
                verifyDuplicateModified: this.verifyDuplicateModified,
            }
        }
    }

    hashPassword(password) {
        return crypto.hashSync(password, 10)
    }

    validateNewUser(newUser) {
        if (!newUser.name || !newUser.name.match(/^[a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,}(?: [a-zA-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+){0,8}$/g)) {
            throw new ValidationError("Nome inválido")
        }

        if (!newUser.email || !newUser.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g)) {
            throw new ValidationError("Email inválido")
        }

        if (!newUser.type || !userType.includes(newUser.type)) {
            throw new ValidationError("Tipo inválido")
        }

        if (!newUser.password) {
            throw new ValidationError("Senha inválida")
        }
    }

    async verifyDuplicate(newUser) {
        let user = await db.user.getByEmail(newUser.email)

        if (user) {
            throw new DuplicationError("Email já cadastrado")
        }

        if (newUser.cardid) {
            user = await db.user.getByCardId(newUser.cardid)

            if (user) {
                throw new DuplicationError("Cartão já cadastrado")
            }
        }
    }

    async verifyDuplicateModified(newUser) {
        let user = await db.user.getByEmail(newUser.email)

        if (user && user.id != newUser.id) {
            throw new DuplicationError("Email já cadastrado")
        }

        if (newUser.cardid) {
            user = await db.user.getByCardId(newUser.cardid)

            if (user && user.id != newUser.id) {
                throw new DuplicationError("Cartão já cadastrado")
            }
        }
    }

}