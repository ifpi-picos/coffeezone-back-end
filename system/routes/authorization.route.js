module.exports = class AuthorizationRoute {
    constructor(app) {
        const { Router } = require('express')
        const routes = Router()

        routes.get('/', (req, res) => {
            try {
                if (req.user.type == 'Coordinator') {
                    const authorizations = app.db.authorization.getAll()

                    res.status(200).json(authorizations)
                }
                else {
                    const authorization = app.db.authorization.getByUserId(req.user.id)

                    res.status(200).json(authorization)
                }
            }
            catch (err) {
                app.log.error(err)
                res.status(500).json({ error: 'Error ao tentar retornar a lista de autorizações' })
            }

        })

        return { path: '/authorization/', router: routes }
    }
}
