const { authorizations } = require('../models')

module.exports = class AuthorizationsRepository {
    constructor() {
        return {
            name: 'authorization',
            functions: {
                getAll: this.getAll,
                getById: this.getById,
                create: this.create,
                updateFieldById: this.updateFieldById,
                deleteById: this.deleteById
            }
        }
    }

    async getAll() {
        return await authorizations.findAll()
    }

    async getById(id) {
        return await authorizations.findOne({ where: { id } })
    }

    async getByUserId(userId) {
        return await authorizations.findOne({ where: { data: { meta: { userid: userId } } } })
    }

    async create(authorization) {
        return await authorizations.create(authorization)
    }

    async updateFieldById(id, field, value) {
        return await authorizations.update({ [field]: value }, { where: { id } })
    }

    async deleteById(id) {
        return await authorizations.destroy({ where: { id } })
    }
}