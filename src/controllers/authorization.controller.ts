export default class AuthorizationController {
    prisma: any
    constructor(prisma: any) {
        this.prisma = prisma
    }

    async getAll(type?: AuthorizationTypes) {
        if (type) {
            return await this.prisma.Authorization.findMany({ where: { type: type } })
        }
        else {
            return await this.prisma.Authorization.findMany()
        }
    }

    async getById(id: number) {
        return await this.prisma.Authorization.findUnique({ where: { id: id } })
    }

    async getByUserId(userId: number) {
        return await this.prisma.Authorization.findUnique({ where: { userid: userId } })
    }

    async create(authorization: Authorization) {
        return await this.prisma.Authorization.create({ data: authorization })
    }

    async updateFieldById(id: number, field: string, value: string) {
        return await this.prisma.Authorization.update({ where: { id: id }, data: { [field]: value } })
    }

    async deleteById(id: number) {
        return await this.prisma.Authorization.delete({ where: { id: id } })
    }

    async approve(authorization: Authorization) {
        return await new Promise(async (resolve, reject) => {
            if (authorization.type == 'Reservation') {
                this.prisma.Reservation.create({ data: authorization.data })
                    .then(() => {
                        this.prisma.Authorization.delete({ where: { id: authorization.id } })
                            .then(() => {
                                resolve(true)
                            })
                            .catch((err: any) => {
                                reject(err)
                            })
                    })
                    .catch((err: any) => {
                        reject(err)
                    })
            }
            else if (authorization.type == 'User') {
                this.prisma.User.create(authorization.data)
                    .then(() => {
                        this.prisma.Authorization.delete({ where: { id: authorization.id } })
                            .then(() => {
                                resolve(true)
                            })
                            .catch((err: any) => {
                                reject(err)
                            })
                    })
                    .catch((err: any) => {
                        reject(err)
                    })
            }
        })
    }

    async deny(authorization: Authorization) {
        return await this.prisma.Authorization.delete({ where: { id: authorization.id } })
    }
}