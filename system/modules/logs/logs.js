const time = require("luxon").DateTime
const { inspect } = require('util')

// Set a variable to save all the logs made by the app
var logTxt = `Log - ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}\n`

module.exports = class Logger {
    constructor() {}

    info(msg) {
        // Log a info message (green)
        if (typeof msg === 'string') { // If the message is a single string
            logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] - ${msg}`.green)
        }
        else { // If the message is a object
            logTxt += `---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n" // Stringfy the entire object
            logTxt += `---------------- [ FIM DA INFO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] ----------------`.green);
            console.log(msg);
            console.log(`---------------- [ FIM DA INFO ] ----------------`.green)
        }
    }

    start(msg) {
        // Log a start message (cyan)
        logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - ${msg}\n`
        console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - ${msg}`.cyan)
    }

    warn(msg) {
        // Log a warning message (yellow)
        if (typeof msg === 'string') {
            logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] - ${msg}`.yellow)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n" // Stringfy the entire object
            logTxt += `---------------- [ FIM DO AVISO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] ----------------`.yellow);
            console.log(msg);
            console.log(`---------------- [ FIM DO AVISO ] ----------------`.yellow);
        }
    }

    error(msg) {
        // Log a error message (red)
        if (typeof msg === 'string') {
            logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] - ${msg}`.red)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n" // Stringfy the entire object
            logTxt += `---------------- [ FIM DO ERRO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] ----------------`.red);
            console.log(msg);
            console.log(`---------------- [ FIM DO ERRO ] ----------------`.red)
        }
    }

    logString(){
        // return the variable with all the logs made by the app
        return logTxt
    }
}