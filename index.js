require('dotenv').config()

require('colors')

const _api = require('./system/api')
const api = new _api()

api.start()