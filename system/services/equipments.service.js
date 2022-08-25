let db

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

module.exports = class EquipmentsService {
    constructor(app) {
        db = app.db

        return {
            name: 'equipment',
            functions: {
                validateEquipment: this.validateEquipment,
            }
        }
    }

    validateEquipment(equipment) {
        if (!equipment.name) {
            throw new ValidationError('Nome do equipamento é obrigatório')
        }

        if (equipment.name.match(/^\s*$/)) {
            throw new ValidationError('Nome do equipamento não pode ser vazio')
        }

        if (equipment.name.length > 255) {
            throw new ValidationError('Nome do equipamento não pode ser maior que 255 caracteres')
        }
    }
}