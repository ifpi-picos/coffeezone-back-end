'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class reservations extends Model {
        static associate(models) {
        }
    }

    reservations.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        equipment: {
            type: DataTypes.TEXT(2048),
            allowNull: true
        },
        time: {
            type: DataTypes.VARCHAR(255),
            allowNull: false
        },
        reason: {
            type: DataTypes.TEXT(2048),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'reservations',
        paranoid: false,
        timestamps: false
    })
    
    return reservations
}


