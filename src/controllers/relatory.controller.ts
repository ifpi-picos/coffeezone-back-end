export default class RelatoryController {
    prisma: any
    constructor(prisma: any) {
        this.prisma = prisma
    }

    async create(newRelatory: Relatory) {
        return await this.prisma.Relatory.create(newRelatory)
    }

    async getByUserId(userid: number) {
        return await this.prisma.Relatory.findOne({ where: { userid } })
    }

    async getAll() {
        return await this.prisma.Relatory.findMany()
    }

    async updateActionsByUserId(userid:number, newAction: Action) {
        return await this.prisma.Relatory.update({ actions: newAction }, { where: { userid } })
    }

    async deleteByUserId(userid: number) {
        return await this.prisma.Relatory.delete({ where: { userid } })
    }
}