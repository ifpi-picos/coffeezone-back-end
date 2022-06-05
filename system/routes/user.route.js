module.exports = class UserRoute {
    constructor(app) {
        const { Router } = require('express');
        const routes = Router()

        routes.post('/', async (req, res) => {
            try {
                app.services.user.validateNewUser(req.body)
                await app.services.user.verifyDuplicate(req.body)
                req.body.password = app.services.user.hashPassword(req.body.password)

                const user = await app.db.user.create(req.body)

                res.status(201).json({ id: user.id })
            }
            catch (err) {
                if (err.name == "ValidationError" || err.name == "DuplicationError") {
                    res.status(400).json({ error: err.message })
                }
                else {
                    app.log.error(err)
                    res.status(500).json({ error: 'Erro ao tentar cadastrar' })
                }
            }
        })

        routes.get('/', async (req, res) => {
            try {
                let user

                if (req.user.type == 'Coordinator') {
                    if (req.body.email) {
                        user = await app.db.user.getByEmail(req.body.email)
                    }
                    else if (req.body.id) {
                        user = await app.db.user.getById(req.body.id)
                    }
                    else if (req.body.cardid) {
                        user = await app.db.user.getByCardId(req.body.cardid)
                    }
                    else {
                        user = await app.db.getById(req.user.id)
                    }
                }
                else {
                    user = await app.db.user.getById(req.user.id)
                }

                if (!user) {
                    res.status(404).json({ error: 'Usuário não encontrado' })
                }
                else {
                    user = user.dataValues

                    res.status(200).json({
                        id: user.id,
                        cardid: user.cardid ? user.cardid : null,
                        name: user.name,
                        email: user.email,
                        occupation: user.occupation,
                        type: user.type,
                        linkedin: user.linkedin ? user.linkedin : null,
                        profileimage: user.profileimage ? user.profileimage : null,
                        preferences: user.preferences
                    })
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: 'Erro ao tentar retornar usuário' })
            }
        })

        routes.patch('/', async (req, res) => {
            try {
                let user = await app.db.user.getById(req.user.id)

                if (!user) {
                    res.status(404).json({ error: 'Usuário não encontrado' })
                }
                else {
                    if (req.body.modify.password) {
                        req.body.modify.password = app.services.user.hashPassword(req.body.modify.password)
                    }

                    if (req.body.modify.id) {
                        delete req.body.modify.id
                    }

                    user = user.dataValues

                    var newUser = Object.assign({}, user, req.body.modify)

                    app.services.user.validateNewUser(newUser)
                    await app.services.user.verifyDuplicateModified(newUser)

                    await app.db.user.updateById(user.id, newUser)
                    res.status(200).json({ success: 'Usuário atualizado' })
                }
            }
            catch (err) {
                if (err.name == "ValidationError" || err.name == "DuplicationError") {
                    res.status(400).json({ error: err.message })
                }
                else {
                    app.log.error(err)
                    res.status(500).json({ error: 'Erro ao tentar modificar usuário' })
                }
            }
        })

        routes.delete('/', async (req, res) => {
            try {
                if (await app.db.user.getById(req.user.id)) {
                    await app.db.user.deleteById(req.user.id)
                    res.status(200).json({ success: 'Usuário deletado' })
                }
                else {
                    res.status(404).json({ error: 'Usuário não encontrado' })
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: 'Erro ao tentar deletar usuário' })
            }
        })

        return { path: '/user/', router: routes }
    }
}