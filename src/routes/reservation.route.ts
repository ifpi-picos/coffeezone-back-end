import { Router } from 'express'
import prisma from '../config/database'
import UserController from '../controllers/user.controller'
import ReservationController from '../controllers/reservation.controller'
import EquipmentController from '../controllers/equipment.controller'
import AuthorizationController from '../controllers/authorization.controller'
import ReservationServices from '../services/reservation.services'
import { DateTime as time } from 'luxon'

const router = Router()
const userController = new UserController(prisma)
const reservationController = new ReservationController(prisma)
const equipmentController = new EquipmentController(prisma)
const authorizationController = new AuthorizationController(prisma)
const reservationServices = new ReservationServices(reservationController, authorizationController)

router.post('/', async (req, res) => {
    try {
        let user = await userController.getById(req.user.id)
        if (user) {
            req.body.userid = user.id

            reservationServices.validateNewReservation(req.body)
            await reservationServices.verifyDuplicate(req.body)

            if (req.body.equipmentid) {
                let equipment = await equipmentController.getById(req.body.equipmentid)

                if (equipment.status != 'Avaliable') {
                    return res.status(400).json({ error: 'Equipamento já reservado' })
                }
                else {
                    await equipmentController.updateFieldById(equipment.id, 'status', 'Reserved')
                }
            }

            const authorization = await authorizationController.create({
                status: 'Pending',
                laststatustime: `${time.local({ zone: "America/Fortaleza" }).toFormat('dd/MM/yyyy|HH:mm:ss')}`,
                type: 'Reservation',
                userid: req.user.id,
                data: {
                    userid: req.user.id,
                    equipmentid: req.body.equipmentid || null,
                    time: req.body.time,
                    reason: req.body.reason || null
                }
            })

            res.status(201).json({ id: authorization.id })
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' })
        }
    } catch (err) {
        if (err.name == 'DuplicationError' || err.name == 'ValidationError') {
            res.status(400).json({ error: err.message })
        } else {
            console.error(err)
            res.status(500).json({ error: 'Erro ao tentar criar uma reserva' })
        }
    }
})

router.get('/', async (req, res) => {
    try {
        let user
        if (req.user.type == 'Coordinator') {
            if (req.body.email) {
                user = await userController.getByEmail(req.body.email)
            } else if (req.body.id) {
                user = await userController.getById(req.body.id)
            } else if (req.body.cardid) {
                user = await userController.getByCardId(req.body.cardid)
            } else {
                user = await userController.getById(req.user.id)
            }
        } else {
            user = await userController.getById(req.user.id)
        }

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' })
        } else {
            let reservations = await reservationController.getByUserId(user.id)

            if (reservations) {
                res.status(200).json({
                    id: reservations.id,
                    userid: reservations.userid,
                    equipmentid: reservations.equipmentid,
                    time: reservations.time,
                    reason: reservations.reason
                })
            } else {
                res.status(404).json({ error: 'Reserva não encontrada' })
            }
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao tentar retornar reserva' })
    }
})

router.patch('/', async (req, res) => {
    try {
        let user = await userController.getById(req.user.id)
        let reservation = await reservationController.getByUserId(user.id)

        if (user) {
            if (!reservation) {
                res.status(404).json({ error: 'Reserva não encontrada' })
            } else {
                if (req.body.modify.id) {
                    delete req.body.modify.id
                }

                reservation = reservation.dataValues

                let newReservation = Object.assign({}, reservation, req.body.modify)

                reservationServices.validateNewReservation(newReservation)
                await reservationServices.verifyDuplicateModified(newReservation)

                await reservationController.updateById(reservation.id, newReservation)
                res.status(200).json({ success: 'Reserva atualizada' })
            }
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' })
        }
    } catch (err) {
        if (err.name == 'ValidationError' || err.name == 'DuplicationError') {
            res.status(400).json({ error: err.message })
        } else {
            console.error(err)
            res.status(500).json({ error: 'Erro ao tentar atualizar reserva' })
        }
    }
})

router.delete('/', async (req, res) => {
    try {
        let user = await userController.getById(req.user.id)
        let reservation = await reservationController.getByUserId(user.id)

        if (user) {
            if (!reservation) {
                res.status(404).json({ error: 'Reserva não encontrada' })
            } else {
                await reservationController.deleteById(reservation.id)
                res.status(200).json({ success: 'Reserva deletada' })
            }
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao tentar deletar reserva' })
    }
})

export default router