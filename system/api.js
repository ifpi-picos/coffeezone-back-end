const path = require('path')
const express = require('express')

module.exports = class API {
    constructor() {
        // Set a new express APP
        this.app = express()

        // Start the modules and set the routes
        this.setLog()
        this.setDB()
        this.setMiddlewares()
        this.setRoutes()
    }

    setLog() {
        // Require and set the custom logger module
        const Log = require('./modules/logs/logs.js')
        this.log = new Log(this)

        // Catch any uncaught exceptions and log them
        process.on('uncaughtException', (err) => {
            this.log.error(err)
        })

        // Catch any unhandled promise rejections and log them
        process.on('unhandledRejection', (err) => {
            this.log.error(err)
        })

        // Log the start of this module
        this.log.start('Logs')
    }

    setDB() {
        // Require the databse module
        const { Sequelize } = require('sequelize');

        // Create the connection string for Sequelize
        const conStr = {
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            logging: false,
            dialect: 'postgres',
        }

        // Add SSL configurations only if in production
        if (process.env.DEPLOY == 'production') {
            conStr['dialectOptions'] = {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }

        // Create the Sequelize instance
        const db = new Sequelize(conStr);

        // Set the database instance in the main app
        this.db = db
        this.log.start('DB')
    }

    setMiddlewares() {
        // Set the public folder as static
        this.app.set('public', path.join(__dirname, 'public'))
        this.app.use(express.static('public'));

        // Set the express module to decoded the json body
        this.app.use(express.json());

        // Automatically redirect any incoming requrest using http to https if in production
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

        // Log all requests received
        this.app.use((req, res, next) => {
            this.log.info(`${req.method} ${req.path}`)
            next()
        })

        this.log.start('Middlewares')
    }

    setRoutes() {
        const glob = require('fast-glob');

        // Get all the routes files
        var routes = glob.sync(['**/routes/*.js', '!node_modules', '!public', '!views', '!modules'])

        const paths = new Array();
        const routers = new Array();

        // Loop through all the routes files and get the paths and the routers
        routes.forEach(r => {
            const route = require(process.cwd()+ "/" + r)
            const router = new route(this)

            paths.push(router.path);
            routers.push(router.router);
        })

        // Set the paths and the routers in the main app
        for (var r in paths) {
            this.app.use(paths[r], routers[r])
        }

        this.log.start('Routes')
    }

    start() {
        // Start the server in the port defined in the .env file
        this.app.listen(process.env.PORT, () => {
            this.log.info(`Servidor iniciado na porta ${process.env.PORT}`)
        });
    }
}