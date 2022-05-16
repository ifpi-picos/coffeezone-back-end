module.exports = class ReservationsRoute {
  constructor (app) {
    const { Router } = require('express')
    const routes = Router()

    routes.post('/', async (req, res) => {
        try{
            // app.services.reservation.validateNewReservation(req.body)
            // await app.
        }
        catch(err){}
    })

    return { path: '/reservation/', router: routes }
  }

}
