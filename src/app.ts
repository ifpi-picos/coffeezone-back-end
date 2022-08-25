import express from 'express';
import cors from 'cors';
import { config } from './config/config';
import { checkConnection } from './config/database'
import middlewares from './middlewares'
import routes from './routes'

const app = express()

const configureExpress = () => {
    if (config.default.env == 'production') {
        app.use(cors())
    }
    app.use(express.json())
    app.use(middlewares)
    app.use(config.default.API_BASE, routes)

    return app
}

const setupApp = checkConnection().then(configureExpress)

export { setupApp }