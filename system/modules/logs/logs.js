const time = require("luxon").DateTime
const { inspect } = require('util')

var logTxt = `Log - ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}\n`

module.exports = class Logger {
    constructor() {}

    info(msg) {
        if (typeof msg === 'string') {
            logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] - ${msg}`.green)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n"
            logTxt += `---------------- [ FIM DA INFO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INFO ] ----------------`.green);
            console.log(msg);
            console.log(`---------------- [ FIM DA INFO ] ----------------`.green)
        }
    }

    start(msg) {
        logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - ${msg}\n`
        console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| INICIADO ] - ${msg}`.cyan)
    }

    warn(msg) {
        if (typeof msg === 'string') {
            logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] - ${msg}`.yellow)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n"
            logTxt += `---------------- [ FIM DO AVISO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| AVISO ] ----------------`.yellow);
            console.log(msg);
            console.log(`---------------- [ FIM DO AVISO ] ----------------`.yellow);
        }
    }

    error(msg) {
        if (typeof msg === 'string') {
            logTxt += `[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] - ${msg}\n`
            console.log(`[ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] - ${msg}`.red)
        }
        else {
            logTxt += `---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] ----------------\n`
            logTxt += inspect(msg, { depth: 99 }) + "\n"
            logTxt += `---------------- [ FIM DO ERRO ] ----------------\n`

            console.log(`---------------- [ ${time.now().setZone('America/Sao_Paulo').toFormat("dd/MM/y | HH:mm:ss ")}| ERRO ] ----------------`.red);
            console.log(msg);
            console.log(`---------------- [ FIM DO ERRO ] ----------------`.red)
        }
    }

    logString(){
        return logTxt
    }
}