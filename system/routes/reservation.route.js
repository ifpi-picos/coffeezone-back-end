module.exports = class ReservationsRoute {
  constructor (app) {
    const { Router } = require('express')
    const routes = Router()

    routes.post('/' , async (req, res) => {
        try{ 
          app.services.reservation.validateNewReservation(req.body)
          await app.services.reservation.verifyDuplicate(req.body)

            const reservation = await app.db.reservation.create({
                userid: req.body.userid,
                equipment: req.body.equipment || null,
                time: req.body.time,
                reason: req.body.reason || null,
            })

            res.status(201).json({id: reservation.id})
        }
        catch(err){
            if (err.name == "DuplicationError" || err.name == "ValidationError") {
              res.status(400).json({ error: err.message })
            } 
            else {
              app.log.error(err)
              res.status(500).json({error: 'Erro ao tentar criar uma reserva' })
            }
        }
    })

    return { path: '/reservation/', router: routes }
  }
}