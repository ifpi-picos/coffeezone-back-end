const { User } = require('../models')

module.exports = class UserRepository {
    constructor(){
        return{
            name: "User",
            functions: {
                create: this.create,
                getByEmail: this.getByEmail,
                getById: this.getById,
                updateById: this.updateById,
                deleteById: this.deleteById
            }
        }
    }
    async create(user) {
        return await User.create(user)
    }

    async getByEmail(email) {
        return await User.findOne({ where: { email } })
    }

    async getById(id) {
        return await User.findByPk(id)
    }

    async updateById(userId, user) {
        return await User.update(user, { where: { id: userId } })
    }

    async deleteById(userId) {
        return await User.destroy({ where: { id: userId } })
    }
}