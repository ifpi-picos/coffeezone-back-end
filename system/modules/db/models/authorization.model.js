'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class authorizations extends Model {
        static associate(models) {
            authorizations.hasOne(models.reservations, {
                foreignKey: 'id',
                as: 'reservationId',
                allowNull: false
            })
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
        reservationid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.TEXT(2048),
            allowNull: false
        },
        laststatustime: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'authorizations',
        paranoid: false,
        timestamps: false
    })
    
    return authorizations
}


