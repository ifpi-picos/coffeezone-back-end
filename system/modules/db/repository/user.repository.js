const { users } = require('../models')

module.exports = class UserRepository {
    constructor() {
        return {
            name: "user",
            functions: {
                create: this.create,
                getByEmail: this.getByEmail,
                getByCardId: this.getByCardId,
                getById: this.getById,
                getAll: this.getAll,
                updateById: this.updateById,
                updateFieldById: this.updateFieldById,
                updatePreferencesById: this.updatePreferencesById,
                deleteById: this.deleteById,
                deleteByEmail: this.deleteByEmail,
                deleteByCardId: this.deleteByCardId,
            }
        }
    }
    
    async create(newUser) {
        return await users.create(newUser)
    }

    async getByEmail(email) {
        return await users.findOne({ where: { email } })
    }

    async getByCardId(cardid) {
        return await users.findOne({ where: { cardid } })
    }

    async getById(id) {
        return await users.findByPk(id)
    }

    async getAll(){
        return await users.findAll()
    }

    async updateById(userId, newUser) {
        return await users.update(newUser, { where: { id: userId } })
    }

    async updateFieldById(userId, field, value) {
        return await users.update({ [field]: value }, { where: { id: userId } })
    }

    async updatePreferencesById(userId, preference, value) {
        return await users.update({
            preference: {
                meta: {
                    [preference]: value
                }
            }
        }, { where: { id: userId } })
    }

    async deleteById(userId) {
        return await users.destroy({ where: { id: userId } })
    }

    async deleteByEmail(email) {
        return await users.destroy({ where: { email } })
    }

    async deleteByCardId(cardid) {
        return await users.destroy({ where: { cardid } })
    }
}