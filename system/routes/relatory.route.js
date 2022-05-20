module.exports = class RelatoryRoute {
  constructor (app) {
    const { Router } = require('express')
    const routes = Router()

    routes.post('/', async (req, res) => {
      try {
          if(!req.body.cardid){
            return res.status(400).json({error: 'ID do cartão faltando'})
          }
        const user = await app.db.user.getByCardId(req.body.cardid)

        if (user) {
          const relatory = await app.db.relatory.getByUserId(user.id)
          const actions = app.services.relatory.createAction(
            relatory ? relatory.actions : null
          )

          if (relatory) {
            await app.db.relatory.updateActionsByUserId(user.id, actions)
          } else {
            await app.db.relatory.create({
              userid: user.id,
              actions: actions
            })
          }
          res.status(200).json({ sucess: "Ação adicionada" })
        } else {
          res.status(404).json({ error: 'Usuario não encontrado' })
        }
      } catch (err) {
        app.log.error(err)
        res.status(500).json({ error: err })
      }
    })

    return { path: '/relatory/', router: routes }
  }
}
