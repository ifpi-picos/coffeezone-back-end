export default class EquipmentController {
    prisma: any
    constructor(prisma: any) {
        this.prisma = prisma
    }

    async getAll() {
        return await this.prisma.Equipment.findMany()
    }

    async getById(id: number) {
        return await this.prisma.Equipment.findUnique({ where: { id } })
    }

    async create(equipment: Equipment) {
        return await this.prisma.Equipment.create({ data: equipment })
    }

    async updateById(id: number, equipment: Equipment) {
        return await this.prisma.Equipment.update({ data: { equipment } }, { where: { id: id } })
    }

    async updateFieldById(id: number, field: string, value: string) {
        return await this.prisma.Equipment.update({ data: { [field]: value } }, { where: { id: id } })
    }

    async deleteById(id: number) {
        return await this.prisma.Equipment.delete({ where: { id: id } })
    }
}