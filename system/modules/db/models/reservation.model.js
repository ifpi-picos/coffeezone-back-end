'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {
            // Define association here
            Reservation.hasOne(models.User, {
                foreignKey: 'id',
                as: 'userId'
            })
        }
    }

    Reservation.init({
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
        modelName: 'Reservation',
        paranoid: false
    })
    
    return Reservation
}


