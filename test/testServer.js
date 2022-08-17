require('dotenv').config()

process.env["NODE_ENV"] = "test"

const { config } = require('../dist/config/config')
const { setupApp } = require('../dist/app')

const isPortTaken = function (port, fn) {
    const net = require('net')
    let tester = net.createServer()
        .once('error', function (err) {
            if (err.code != 'EADDRINUSE') return fn(err)
            fn(true)
        })
        .once('listening', function () {
            tester.once('close', function () { fn(false) })
                .close()
        })
        .listen(port)
}

module.exports = async () => {
    const app = await setupApp

    isPortTaken(config.default.PORT, (taken) => { 
        if(!taken){
            app.listen(config.default.PORT, () => console.info(`Listening port ${config.default.PORT}`))
        }
    })
}