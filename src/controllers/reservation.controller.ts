export default class ReservationController {
    prisma: any
    constructor(prisma: any) {
        this.prisma = prisma
    }

    async create(newReservation: Reservation) {
        return await this.prisma.Reservation.create(newReservation)
    }

    async getByUserId(userId: number) {
        return await this.prisma.Reservation.findUnique({
            where: {
                userid: userId
            }
        })
    }

    async getAll() {
        return await this.prisma.Reservation.findMany()
    }

    async updateById(id: number, newReservation: Reservation) {
        return await this.prisma.Reservation.update({ data: newReservation, where: { id: id } })
    }

    async deleteById(id: number) {
        return await this.prisma.Reservation.delete({ where: { id: id } })
    }
}