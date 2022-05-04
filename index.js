// Set the environment variables
require('dotenv').config()

// Set colors to the custom logger module
require('colors')

// Require and create a new instance of the API
const _api = require('./system/api')
const api = new _api()

// Start the API
api.start()