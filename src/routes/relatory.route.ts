import { Router } from 'express';
import prisma from '../config/database'
import EquipmentController from '../controllers/equipment.controller'
import EquipmentServices from '../services/equipment.services'

const router = Router()
const equipmentController = new EquipmentController(prisma)
const equipmentServices = new EquipmentServices(equipmentController)

router.post('/', async (req, res) => {
    try {
        if (req.user.type == 'Coordinator') {
            equipmentServices.validateEquipment(req.body)

            const equipment = await equipmentController.create({
                name: req.body.name,
                status: "Avaliable"
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
            console.error(err)
            res.status(500).json({ error: 'Erro ao tentar cadastrar novo equipamento' })
        }
    }
})

router.get('/', async (req, res) => {
    try {
        let equipment
        if (req.user.type == 'Coordinator') {
            if (req.body.id) {
                equipment = await equipmentController.getById(req.body.id)
            }
            else if (req.body.getAll) {
                equipment = await equipmentController.getAll()
            }

            if (equipment) {
                res.status(200).json(equipment)
            }
            else {
                res.status(404).json({ error: 'Nenhum equipamento encontrado' })
            }
        }
        else {
            equipment = await equipmentController.getAll()
            equipment = equipment.dataValues

            res.status(200).json({
                id: equipment.id,
                name: equipment.name,
                status: equipment.status,
            })
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao tentar buscar equipamento' })
    }
})

router.patch('/', async (req, res) => {
    try {
        let equipment = await equipmentController.getById(req.body.id)

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
                res.status(403).json({ error: 'Apenas coordenadores podem modificar equipamentos' })
            }

            equipmentServices.validateEquipment(newEquipment)

            await equipmentController.updateById(equipment.id, newEquipment)
            res.status(200).json({ success: 'Equipamento atualizado' })
        }
    }
    catch (err) {
        if (err.name == "ValidationError") {
            res.status(400).json({ error: err.message })
        }
        else {
            console.error(err)
            res.status(500).json({ error: 'Erro ao tentar atualizar equipamento' })
        }
    }
})

router.delete('/', async (req, res) => {
    try {
        if (req.user.type == 'Coordinator') {
            const equipment = await equipmentController.getById(req.body.id)

            if (!equipment) {
                res.status(404).json({ error: 'Equipamento não encontrado' })
            }
            else {
                await equipmentController.deleteById(req.body.id)
                res.status(200).json({ success: 'Equipamento deletado' })
            }
        }
        else {
            res.status(403).json({ error: 'Apenas coordenadores podem deletar equipamentos' })
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao tentar deletar equipamento' })
    }
})

export default router