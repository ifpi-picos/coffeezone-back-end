'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class authorizations extends Model {
        static associate(models) {
        }
    }

    authorizations.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.TEXT(2048),
            allowNull: false
        },
        laststatustime: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'authorizations',
        paranoid: false,
        timestamps: false
    })
    
    return authorizations
}


