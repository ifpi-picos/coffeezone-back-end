const { user } = require('../models')

module.exports = class UserRepository {
    constructor(){
        return{
            name: "user",
            functions: {
                create: this.create,
                getByEmail: this.getByEmail,
                getById: this.getById,
                updateById: this.updateById,
                deleteById: this.deleteById
            }
        }
    }
    async create(newUser) {
        return await user.create(newUser)
    }

    async getByEmail(email) {
        return await user.findOne({ where: { email } })
    }

    async getById(id) {
        return await user.findByPk(id)
    }

    async updateById(userId, user) {
        return await user.update(user, { where: { id: userId } })
    }

    async deleteById(userId) {
        return await user.destroy({ where: { id: userId } })
    }
}