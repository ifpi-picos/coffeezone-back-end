const time = require("luxon").DateTime
let db

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

module.exports = class ReservationService {
    constructor(app) {
        db = app.db

        return {
            name: "reservation",
            functions: {
                verifyDuplicate: this.verifyDuplicate,
                validateNewReservation: this.validateNewReservation
            }
        }
    }

    validateNewReservation(newReservation) {
        if(!newReservation.userid) {
            throw new ValidationError('O usuário é obrigatório')
        }

        if(newReservation.time) {
            const newStartTime = time.fromFormat(newReservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
            const newEndTime = time.fromFormat(newReservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

            if(!newStartTime || !newEndTime) {
                throw new ValidationError('O horário de início e fim são obrigatórios')
            }

            if(newStartTime.toMillis() >= newEndTime.toMillis()) {
                throw new ValidationError('O horário de início deve ser menor que o de fim')
            }

            if(newStartTime.toMillis() < time.local().toMillis()) {
                throw new ValidationError('O horário de início deve ser maior que o atual')
            }

            if(newStartTime.hour >= 7 && newEndTime.hour <= 22){
                throw new ValidationError('O horário de início deve ser maior que 7 horas e menor que 22 horas')
            }

            if(newStartTime.hour <= 22 && newEndTime.hour >= 22){
                throw new ValidationError('O horário de fim deve ser menor que 22 horas e maior que 7 horas')
            }

            if(newStartTime.weekday === 6 || newStartTime.weekday === 7){
                throw new ValidationError('Não é possível reservar no final de semana')
            }
        }
        else{
            throw new ValidationError('O horário de início e fim são obrigatórios')
        }

        if(newReservation.equipment){
            if(newReservation.equipment.length > 2048) {
                throw new ValidationError('Texto muito grande para o equipamento')
            }
        }

        if(newReservation.reason){
            if(newReservation.reason.length > 2048) {
                throw new ValidationError('Texto muito grande para o motivo')
            }
        }
    }

    async verifyDuplicate(newReservation) {
        let reservationUser = await db.reservation.getByUserId(newReservation.userid)

        if (reservationUser.length > 0) {
            throw new DuplicationError('O usuário já possui uma reserva')
        }

        let reservations = await db.reservation.getAll()

        const newStartTime = time.fromFormat(newReservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
        const newEndTime = time.fromFormat(newReservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

        reservations.forEach(reservation => {
            const startTime = time.fromFormat(reservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
            const endTime = time.fromFormat(reservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

            if (newStartTime.toMillis() >= startTime.toMillis() && newStartTime.toMillis() <= endTime.toMillis()) {
                throw new DuplicationError('O horário de início está em conflito com outra reserva')
            }
        })
    }
}