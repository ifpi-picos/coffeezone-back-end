const { reservations } = require('../models')

module.exports = class ReservationRepository {
    constructor(){
        return{
            name: "reservation",
            functions: {}
        }
    }
}