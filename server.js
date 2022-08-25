require('dotenv').config()

const { config } = require('./dist/config/config')
const { setupApp } = require('./dist/app')

setupApp
    .then((app) => { 
        app.listen(config.default.PORT, () => console.info(`Listening port ${config.default.PORT}`))
     })
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })