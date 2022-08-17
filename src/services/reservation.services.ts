import { DateTime as time } from 'luxon'

class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

class DuplicationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DuplicationError';
    }
}

export default class ReservationServices {
    Reservation: any
    Authorization: any
    constructor(Reservation: any, Authorization: any) {
        this.Reservation = Reservation,
        this.Authorization = Authorization
    }

    validateNewReservation(newReservation: Reservation) {
        if (!newReservation.userid) {
            throw new ValidationError('O usuário é obrigatório')
        }

        if (newReservation.time) {
            const newStartTime = time.fromFormat(newReservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
            const newEndTime = time.fromFormat(newReservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

            if (!newStartTime || !newEndTime) {
                throw new ValidationError('O horário de início e fim são obrigatórios')
            }

            if (newStartTime.toMillis() >= newEndTime.toMillis()) {
                throw new ValidationError('O horário de início deve ser menor que o de fim')
            }

            if (newStartTime.toMillis() < time.local().toMillis()) {
                throw new ValidationError('O horário de início deve ser maior que o atual')
            }

            if (newStartTime.hour < 7 || newStartTime.hour > 21) {
                throw new ValidationError('O horário de início deve ser entre 7:00 e 21:00')
            }

            if (newEndTime.hour < 8 || newEndTime.hour > 22) {
                throw new ValidationError('O horário de fim deve ser entre 8:00 e 22:00')
            }

            if (newStartTime.weekday === 6 || newStartTime.weekday === 7) {
                throw new ValidationError('Não é possível reservar no final de semana')
            }
        }
        else {
            throw new ValidationError('O horário de início e fim são obrigatórios')
        }

        if (newReservation.reason) {
            if (newReservation.reason.length > 2048) {
                throw new ValidationError('Texto muito grande para o motivo')
            }
        }
    }

    async verifyDuplicate(newReservation: Reservation) {
        let reservationUser = await this.Reservation.getByUserId(newReservation.userid)

        if (reservationUser) {
            throw new DuplicationError('O usuário já possui uma reserva')
        }

        let reservations = await this.Reservation.getAll()

        const newStartTime = time.fromFormat(newReservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
        const newEndTime = time.fromFormat(newReservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

        reservations.forEach((reservation: Reservation) => {
            const startTime = time.fromFormat(reservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
            const endTime = time.fromFormat(reservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

            if (newStartTime.toMillis() >= startTime.toMillis() && newStartTime.toMillis() <= endTime.toMillis()) {
                throw new DuplicationError('O horário de início está em conflito com outra reserva')
            }

            if (newEndTime.toMillis() >= startTime.toMillis() && newEndTime.toMillis() <= endTime.toMillis()) {
                throw new DuplicationError('O horário de fim está em conflito com outra reserva')
            }
        })

        const authorizations = await this.Authorization.getAll('Reservation')

        authorizations.forEach((authorization: Authorization) => {
            if (authorization.data instanceof ReservationBuilder) {
                const startTime = time.fromFormat(authorization.data.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
                const endTime = time.fromFormat(authorization.data.time.split('-')[1], 'dd/MM/yyyy|HH:mm')


                if (newStartTime.toMillis() >= startTime.toMillis() && newStartTime.toMillis() <= endTime.toMillis()) {
                    throw new DuplicationError('O horário de início está em conflito com uma reserva ainda em autorização')
                }

                if (newEndTime.toMillis() >= startTime.toMillis() && newEndTime.toMillis() <= endTime.toMillis()) {
                    throw new DuplicationError('O horário de fim está em conflito com uma reserva ainda em autorização')
                }
            }
        })
    }

    async verifyDuplicateModified(newReservation: Reservation) {
        let reservations = await this.Reservation.getAll()

        const newStartTime = time.fromFormat(newReservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
        const newEndTime = time.fromFormat(newReservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

        reservations.forEach((reservation: Reservation) => {
            const startTime = time.fromFormat(reservation.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
            const endTime = time.fromFormat(reservation.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

            if (newStartTime.toMillis() >= startTime.toMillis() && newStartTime.toMillis() <= endTime.toMillis() && reservation.id !== newReservation.id) {
                throw new DuplicationError('O horário de início está em conflito com outra reserva')
            }
        })

        const authorizations = await this.Authorization.getAll('Reservation')
        authorizations.forEach((authorization: Authorization) => {
            if (authorization.data instanceof ReservationBuilder) {
                const startTime = time.fromFormat(authorization.data.time.split('-')[0], 'dd/MM/yyyy|HH:mm')
                const endTime = time.fromFormat(authorization.data.time.split('-')[1], 'dd/MM/yyyy|HH:mm')

                if (newStartTime.toMillis() >= startTime.toMillis() && newStartTime.toMillis() <= endTime.toMillis() && authorization.id !== newReservation.id) {
                    throw new DuplicationError('O horário de início está em conflito com uma reserva ainda em autorização')
                }
            }
        })
    }
}