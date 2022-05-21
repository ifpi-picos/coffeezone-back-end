const { reservations } = require('../models')

module.exports = class ReservationRepository {
    constructor() {
        return {
            name: "reservation",
            functions: {
                create: this.create,
                getByUserId: this.getByUserId,
                getAll: this.getAll,
                updateById: this.updateById,
                deleteById: this.deleteById,
            }
        }
    }

    async create(newReservation) {
        return await reservations.create(newReservation)
    }

    async getByUserId(userId) {
        return await reservations.findOne({
            where: {
                userid: userId
            }
        })
    }

    async getAll() {
        return await reservations.findAll()
    }

    async updateById(id, newReservation) {
        return await reservations.update(newReservation, { where: { id: id } })
    }

    async deleteById(id) {
        return await reservations.destroy({ where: { id: id } })
    }
}