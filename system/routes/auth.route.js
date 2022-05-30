module.exports = class AuthRoute {
    constructor(app) {
        const { Router } = require('express');
        const routes = Router()

        routes.post("/login", async (req, res) => {
            try {
                if (req.body.password && req.body.email) {
                    let user = await app.db.user.getByEmail(req.body.email)

                    if (user) {
                        user = user.dataValues
                        if (app.services.auth.comparePassword(req.body.password, user.password)) {
                            const token = app.services.auth.createToken(user)

                            res.status(200).json({ token: token })
                        }
                        else {
                            res.status(401).json({ error: "Senha incorreta" })
                        }
                    }
                    else {
                        res.status(404).json({ error: "Usuário não encontrado" })
                    }
                }
                else {
                    res.status(400).json({ error: "Dados faltando ou incorretos" })
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: "Erro ao tentar autenticar" })
            }
        });

        routes.post("/recovery", async (req, res) => {
            try {
                if (req.body.email) {
                    let user = await app.db.user.getByEmail(req.body.email)

                    if (user) {
                        user = user.dataValues
                        const token = app.services.auth.createRecoveryToken(user)
                        const mailInfo = await app.mailer.sendRecoveryEmail(user, token)

                        if (mailInfo.accepted.includes(user.email)) {
                            res.status(200).json({ message: "Email enviado com sucesso" })
                        }
                        else {
                            res.status(500).json({ error: "Email enviado mas não aceito pelo usuário" })
                        }
                    }
                    else {
                        res.status(404).json({ error: "Usuário não encontrado" })
                    }
                }
                else {
                    res.status(400).json({ error: "Dados faltando ou incorretos" })
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: "Erro ao tentar enviar email de recuperação" })
            }
        })

        return { path: '/auth/', router: routes }
    }
}