class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export default class ReservationServices {
    Equipment: any
    constructor(Equipment: any) {
        this.Equipment = Equipment
    }

    validateEquipment(equipment: Equipment) {
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