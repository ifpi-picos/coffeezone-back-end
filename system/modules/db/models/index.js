'use strict'

const Sequelize = require('sequelize');
const glob = require('fast-glob')

// Create the connection string for Sequelize
const conStr = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
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
const sequelize = new Sequelize(conStr)
const db = new Object()

// Get all the models files and set then in the db object
glob.sync(['**/models/*.model.js', '!node_modules', '!modules'], { cwd: process.cwd(), onlyFiles: true })
    .forEach(file => {
        file = "./" + file.replace("system/modules/db/models/", "")
        const model = require(file)(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

// Run the associations of each model
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
});

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db