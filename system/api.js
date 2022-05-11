const path = require('path')
const express = require('express')
const glob = require('fast-glob');

module.exports = class API {
    constructor() {
        this.app = express()

        this.setLog()
        this.setDB()
        this.setServices()
        this.setMiddlewares()
        this.setRoutes()
    }

    setLog() {
        const Log = require('./modules/logs/logs.js')
        this.log = new Log(this)

        process.on('uncaughtException', (err) => {
            this.log.error(err)
        })

        process.on('unhandledRejection', (err) => {
            this.log.error(err)
        })

        this.log.start('Logs')
    }

    setDB() {
        const { sequelize } = require('./modules/db/models')

        this.db = new Object()
        glob.sync(['**/repository/*.repository.js', '!node_modules'], { cwd: process.cwd() })
            .forEach(file => {
                const Repository = require(process.cwd() + "/" + file)
                const repository = new Repository()
                this.db[repository.name] = repository.functions
            })

        sequelize.authenticate()

        this.log.start('DB')
    }

    setMiddlewares() {
        this.app.set('public', path.join(__dirname, 'public'))
        this.app.use(express.static('public'));

        this.app.use(express.json());

        if (process.env.DEPLOY === 'production') {
            this.app.use((req, res, next) => {
                if (req.header('x-forwarded-proto') !== 'https') {
                    res.redirect(`https://${req.header('host')}${req.url}`)
                }
                else {
                    next()
                }
            })
        }

        this.app.use((req, res, next) => {
            this.log.info(`${req.method} ${req.path}`)
            next()
        })

        this.log.start('Middlewares')
    }

    setServices() {
        this.services = new Object()
        glob.sync(['**/services/*.service.js', '!node_modules'], { cwd: process.cwd() })
            .forEach(file => {
                const Service = require(process.cwd() + "/" + file)
                const service = new Service(this)
                this.services[service.name] = service.functions
            })

        this.log.start('Services')
    }

    setRoutes() {
        var routes = glob.sync(['**/routes/*.js', '!node_modules', '!public', '!views', '!modules'])

        const paths = new Array();
        const routers = new Array();

        routes.forEach(r => {
            const route = require(process.cwd() + "/" + r)
            const router = new route(this)

            paths.push(router.path);
            routers.push(router.router);
        })

        for (var r in paths) {
            this.app.use(paths[r], routers[r])
        }

        this.log.start('Routes')
    }

    start() {
        this.app.listen(process.env.PORT, () => {
            this.log.info(`Servidor iniciado na porta ${process.env.PORT}`)
        });
    }
}