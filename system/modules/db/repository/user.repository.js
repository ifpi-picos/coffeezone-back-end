const { user } = require('../models')

module.exports = class UserRepository {
    constructor(){
        return{
            name: "user",
            functions: {
                create: this.create,
                getByEmail: this.getByEmail,
                getByCardId: this.getByCardId,
                getById: this.getById,
                updateById: this.updateById,
                updateFieldById: this.updateFieldById,
                deleteById: this.deleteById,
                deleteByEmail: this.deleteByEmail,
                deleteByCardId: this.deleteByCardId,
            }
        }
    }
    async create(newUser) {
        return await user.create(newUser)
    }

    async getByEmail(email) {
        return await user.findOne({ where: { email } })
    }

    async getByCardId(cardid) {
        return await user.findOne({ where: { cardid } })
    }

    async getById(id) {
        return await user.findByPk(id)
    }

    async updateById(userId, newUser) {
        return await user.update(newUser, { where: { id: userId } })
    }

    async updateFieldById(userId, field, value) {
        return await user.update({ [field]: value }, { where: { id: userId } })
    }

    async deleteById(userId) {
        return await user.destroy({ where: { id: userId } })
    }

    async deleteByEmail(email) {
        return await user.destroy({ where: { email } })
    }

    async deleteByCardId(cardid) {
        return await user.destroy({ where: { cardid } })
    }
}