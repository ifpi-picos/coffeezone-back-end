const time = require("luxon").DateTime

module.exports = class ReservationsRoute {
  constructor(app) {
    const { Router } = require('express')
    const routes = Router()

    routes.post('/', async (req, res) => {
      try {
        let user = await app.db.user.getById(req.user.id)
        if (user) {
          req.body.userid = user.id

          app.services.reservation.validateNewReservation(req.body)
          await app.services.reservation.verifyDuplicate(req.body)

          if (req.body.equipmentid) {
            let equipment = await app.db.equipment.getById(req.body.equipmentid)

            if (equipment.status != 'Disponível') {
              return res.status(400).json({ error: 'Equipamento já reservado' })
            } 
            else {
              await app.db.equipment.updateById(equipment.id, 'status', 'Em uso')
            }
          }

          const authorization = await app.db.authorization.create({
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
          app.log.error(err)
          res.status(500).json({ error: 'Erro ao tentar criar uma reserva' })
        }
      }
    })

    routes.get('/', async (req, res) => {
      try {
        let user
        if (req.user.type == 'Coordinator') {
          if (req.body.email) {
            user = await app.db.user.getByEmail(req.body.email)
          } else if (req.body.id) {
            user = await app.db.user.getById(req.body.id)
          } else if (req.body.cardid) {
            user = await app.db.user.getByCardId(req.body.cardid)
          } else {
            user = await app.db.user.getById(req.user.id)
          }
        } else {
          user = await app.db.user.getById(req.user.id)
        }

        if (!user) {
          res.status(404).json({ error: 'Usuário não encontrado' })
        } else {
          let reservations = await app.db.reservation.getByUserId(user.id)

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
        app.log.error(err)
        res.status(500).json({ error: 'Erro ao tentar retornar reserva' })
      }
    })

    routes.patch('/', async (req, res) => {
      try {
        let user = await app.db.user.getById(req.user.id)
        let reservation = await app.db.reservation.getByUserId(user.id)

        if (user) {
          if (!reservation) {
            res.status(404).json({ error: 'Reserva não encontrada' })
          } else {
            if (req.body.modify.id) {
              delete req.body.modify.id
            }

            reservation = reservation.dataValues

            let newReservation = Object.assign({}, reservation, req.body.modify)

            app.services.reservation.validateNewReservation(newReservation)
            await app.services.reservation.verifyDuplicateModified(
              newReservation
            )

            await app.db.reservation.updateById(reservation.id, newReservation)
            res.status(200).json({ success: 'Reserva atualizada' })
          }
        } else {
          res.status(404).json({ error: 'Usuário não encontrado' })
        }
      } catch (err) {
        if (err.name == 'ValidationError' || err.name == 'DuplicationError') {
          res.status(400).json({ error: err.message })
        } else {
          app.log.error(err)
          res.status(500).json({ error: 'Erro ao tentar atualizar reserva' })
        }
      }
    })

    routes.delete('/', async (req, res) => {
      try {
        let user = await app.db.user.getById(req.user.id)
        let reservation = await app.db.reservation.getByUserId(user.id)

        if (user) {
          if (!reservation) {
            res.status(404).json({ error: 'Reserva não encontrada' })
          } else {
            await app.db.reservation.deleteById(reservation.id)
            res.status(200).json({ success: 'Reserva deletada' })
          }
        } else {
          res.status(404).json({ error: 'Usuário não encontrado' })
        }
      } catch (err) {
        app.log.error(err)
        res.status(500).json({ error: 'Erro ao tentar deletar reserva' })
      }
    })

    return { path: '/reservation/', router: routes }
  }
}
