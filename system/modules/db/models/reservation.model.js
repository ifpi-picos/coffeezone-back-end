'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class reservation extends Model {
        static associate(models) {
            reservation.hasOne(models.user, {
                foreignKey: 'id',
                as: 'userId'
            })
        }
    }

    reservation.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        equipment: {
            type: DataTypes.TEXT(2048),
            allowNull: true
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        reason: {
            type: DataTypes.TEXT(2048),
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'reservation',
        paranoid: false,
        timestamps: false
    })
    
    return reservation
}


