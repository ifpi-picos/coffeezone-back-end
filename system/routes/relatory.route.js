module.exports = class RelatoryRoute {
  constructor(app) {
    const { Router } = require('express')
    const routes = Router()

    routes.post('/', async (req, res) => {
      try {
        if (!req.body.cardid) {
          return res.status(400).json({ error: 'ID do cartão faltando' })
        }
        const user = await app.db.user.getByCardId(req.body.cardid)

        if (user) {
          const relatory = await app.db.relatory.getByUserId(user.id)
          const actions = app.services.relatory.createAction(
            relatory ? relatory.actions : null
          )

          if (relatory) {
            await app.db.relatory.updateActionsByUserId(user.id, actions.newAction)
          } else {
            console.log(actions)
            await app.db.relatory.create({
              userid: user.id,
              actions: actions.newAction
            })
          }

          if (user.preferences.sendActionRegEmail) {
            app.mailer.sendActionRegisteredEmail(user, actions)
          }

          res.status(200).json({ success: 'Ação adicionada' })
        } else {
          res.status(404).json({ error: 'Usuario não encontrado' })
        }
      } catch (err) {
        app.log.error(err)
        res.status(500).json({ error: 'Erro ao tentar registrar ação' })
      }
    })

    routes.get('/', async (req, res) => {
      try {
        let user = await app.db.user.getById(req.user.id)

        if (user) {
          if (user.type == 'Coordinator') {
            let userToGet

            if (req.body.email) {
              userToGet = await app.db.user.getByEmail(req.body.email)
            } else if (req.body.id) {
              userToGet = await app.db.user.getById(req.body.id)
            } else if (req.body.cardid) {
              userToGet = await app.db.user.getByCardId(req.body.cardid)
            }

            if (userToGet) {
              const relatory = await app.db.relatory.getByUserId(userToGet.id)

              if (relatory) {
                res
                  .status(200)
                  .json({ userid: relatory.userid, actions: relatory.actions })
              } else {
                res
                  .status(404)
                  .json({ error: 'Nenhum relatório deste usuário' })
              }
            } else {
              if (req.body.getAll) {
                const relatory = await app.db.relatory.getAll()

                res.status(200).json({ relatory })
              } else {
                const relatory = await app.db.relatory.getByUserId(req.user.id)

                if (relatory) {
                  res
                    .status(200)
                    .json({ userid: relatory.userid, actions: relatory.actions })
                }
                else {
                  res.status(404).json({ error: 'Nenhum relatório encontrado' })
                }

              }
            }
          } else {
            const relatory = await app.db.relatory.getByUserId(user.id)

            if (relatory) {
              res.status(200).json({ userid: relatory.userid, actions: relatory.actions })
            } else {
              res.status(404).json({ error: 'Nenhum relatório deste usuário' })
            }
          }
        }
      } catch (err) {
        app.log.error(err)
        res.status(500).json({ error: 'Erro ao tentar retornar relatório' })
      }
    })

    return { path: '/relatory/', router: routes }
  }
}
