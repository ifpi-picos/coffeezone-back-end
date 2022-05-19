const { reservations } = require('../models')

module.exports = class ReservationRepository {
    constructor(){
        return{
            name: "reservation",
            functions: {
                create: this.create,
                getByUserId: this.getByUserId,
                getAll: this.getAll 
            }
        }
    }

    async create(newReservation) {
        return await reservations.create(newReservation)
    }

    async getByUserId(userId) {
        return await reservations.findAll({
            where: {
                userid: userId
            }
        })
    }

    async getAll() {
        return await reservations.findAll()
    }
}