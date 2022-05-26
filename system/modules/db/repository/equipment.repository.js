const { equipments } = require('../models')

module.exports = class EquipmentsRepository {
    constructor() {
        return {
            name: 'equipment',
            functions: {
                getAll: this.getAll,
                getById: this.getById,
                create: this.create,
                updateFieldById: this.updateFieldById,
                deleteById: this.deleteById
            }
        }
    }

    async getAll() {
        return await equipments.findAll()
    }

    async getById(id) {
        return await equipments.findOne({ where: { id } })
    }

    async create(equipment) {
        return await equipments.create(equipment)
    }

    async updateFieldById(id, field, value) {
        return await equipments.update({[field]: value}, { where: { id } })
    }

    async deleteById(id) {
        return await equipments.destroy({ where: { id } })
    }


}
