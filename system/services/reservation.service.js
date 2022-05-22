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
                validateNewReservation: this.validateNewReservation,
                verifyDuplicateModified: this.verifyDuplicateModified
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

            if(newStartTime.hour < 7 || newStartTime.hour > 21) {
                throw new ValidationError('O horário de início deve ser entre 7:00 e 21:00')
            }

            if(newEndTime.hour < 8 || newEndTime.hour > 22) {
                throw new ValidationError('O horário de fim deve ser entre 8:00 e 22:00')
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

        if (reservationUser) {
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

            if (newEndTime.toMillis() >= startTime.toMillis() && newEndTime.toMillis() <= endTime.toMillis()) {
                throw new DuplicationError('O horário de fim está em conflito com outra reserva')
            }
        })
    }

    async verifyDuplicateModified (newReservation){
        let reservations = await db.reservation.getAll()

        const newStartTime = time.fromFormat(newReservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
        const newEndTime = time.fromFormat(newReservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

        reservations.forEach(reservation => {
            const startTime = time.fromFormat(reservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
            const endTime = time.fromFormat(reservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

            if (newStartTime.toMillis() >= startTime.toMillis() && newStartTime.toMillis() <= endTime.toMillis() && reservation.id !== newReservation.id) {
                throw new DuplicationError('O horário de início está em conflito com outra reserva')
            }
        })
    }
}