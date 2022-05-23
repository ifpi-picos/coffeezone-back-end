module.exports = class EquipmentRoute {
    constructor(app) {
        const { Router } = require('express')
        const routes = Router()

        routes.post('/', async (req, res) => {
            try {
                if (req.user.type == 'Coordinator') {
                    app.services.equipment.validateEquipment(req.body)

                    const equipment = await app.db.equipment.create({
                        name: req.body.name,
                        status: "Disponível"
                    })

                    res.status(201).json({ id: equipment.id })
                }
                else {
                    res.status(403).json({ error: 'Apenas coordenadores podem adicionar equipamentos' })
                }
            }
            catch (err) {
                if (err.name == "ValidationError") {
                    res.status(400).json({ error: err.message })
                }
                else {
                    app.log.error(err)
                    res.status(500).json({ error: 'Erro ao tentar cadastrar novo equipamento' })
                }
            }
        })

        routes.get('/', async (req, res) => {
            try {
                let equipment
                if (req.user.type == 'Coordinator') {
                    if (req.body.id) {
                        equipment = await app.db.equipment.getById(req.body.id)
                    }
                    else if (req.body.getAll) {
                        equipment = await app.db.equipment.getAll()
                    }
                }
                else {
                    equipment = await app.db.equipment.getById(req.user.id)
                }

                if (!equipment) {
                    res.status(404).json({ error: 'Equipamento não encontrado' })
                }
                else {
                    if (req.body.getAll) {
                        res.status(200).json(equipment)
                    }
                    else {
                        equipment = equipment.dataValues

                        res.status(200).json({
                            id: equipment.id,
                            name: equipment.name,
                            status: equipment.status,
                        })
                    }
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: 'Erro ao tentar buscar equipamento' })
            }
        })

        routes.patch('/', async (req, res) => {
            try {
                let equipment = await app.db.equipment.getById(req.body.id)

                if (!equipment) {
                    res.status(404).json({ error: 'Equipamento não encontrado' })
                }
                else {
                    equipment = equipment.dataValues
                    let newEquipment

                    if (req.user.type == 'Coordinator') {
                        if (req.body.modify.id) {
                            delete req.body.modify.id
                        }

                        newEquipment = Object.assign({}, equipment, req.body.modify)
                    }
                    else {
                        if (req.body.modify.id) {
                            delete req.body.modify.id
                        }
                        else if (req.body.modify.name) {
                            delete req.body.modify.name
                        }

                        newEquipment = Object.assign({}, equipment, req.body.modify)
                    }

                    app.services.equipment.validateEquipment(newEquipment)

                    await app.db.equipment.updateById(equipment.id, newEquipment)
                    res.status(200).json({ success: 'Equipamento atualizado' })
                }
            }
            catch (err) {
                if (err.name == "ValidationError") {
                    res.status(400).json({ error: err.message })
                }
                else {
                    app.log.error(err)
                    res.status(500).json({ error: 'Erro ao tentar atualizar equipamento' })
                }
            }
        })

        routes.delete('/', async (req, res) => {
            try {
                if (req.user.type == 'Coordinator') {
                    const equipment = await app.db.equipment.getById(req.body.id)

                    if (!equipment) {
                        res.status(404).json({ error: 'Equipamento não encontrado' })
                    }
                    else {
                        await app.db.equipment.deleteById(req.body.id)
                        res.status(200).json({ success: 'Equipamento deletado' })
                    }
                }
                else {
                    res.status(403).json({ error: 'Apenas coordenadores podem deletar equipamentos' })
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: 'Erro ao tentar deletar equipamento' })
            }
        })

        return { path: '/equipment/', router: routes }
    }
}