'use strict'

const Sequelize = require('sequelize');
const glob = require('fast-glob')

const conStr = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    dialect: 'postgres',
}

if (process.env.DEPLOY == 'production') {
    conStr['dialectOptions'] = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

const sequelize = new Sequelize(conStr)
const db = new Object()

glob.sync(['**/models/*.model.js', '!node_modules', '!modules'], { cwd: process.cwd(), onlyFiles: true })
    .forEach(file => {
        file = "./" + file.replace("system/modules/db/models/", "")
        const model = require(file)(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
});

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db