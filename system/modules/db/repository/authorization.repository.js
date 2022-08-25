const { authorizations, users, reservations } = require('../models')

module.exports = class AuthorizationsRepository {
    constructor() {
        return {
            name: 'authorization',
            functions: {
                getAll: this.getAll,
                getById: this.getById,
                getByUserId: this.getByUserId,
                create: this.create,
                updateFieldById: this.updateFieldById,
                deleteById: this.deleteById
            }
        }
    }

    async getAll(type) {
        if (type) {
            return await authorizations.findAll({ where: { type: type } })
        }
        else {
            return await authorizations.findAll()
        }
    }

    async getById(id) {
        return await authorizations.findOne({ where: { id } })
    }

    async getByUserId(userId) {
        return await authorizations.findOne({ where: { userid: userId } })
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

    async approve(authorization) {
        return await new Promise(async (resolve, reject) => {
            if (authorization.type == "Reservation") {
                reservations.create(authorization.data)
                    .then(() => {
                        authorizations.destroy({ where: { id: authorization.id } })
                            .then(() => {
                                resolve()
                            })
                            .catch(err => {
                                reject(err)
                            })
                    })
                    .catch(err => {
                        reject(err)
                    })
            }
            else if (authorization.type == "User") {
                users.create(authorization.data)
                    .then(() => {
                        authorizations.destroy({ where: { id: authorization.id } })
                            .then(() => {
                                resolve()
                            })
                            .catch(err => {
                                reject(err)
                            })
                    })
                    .catch(err => {
                        reject(err)
                    })
            }
        })
    }

    async deny(authorization) {
        return await authorizations.destroy({ where: { id: authorization.id } })
    }
}