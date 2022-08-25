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
        userid: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM,
            values: ['Reservation', 'User'],
            allowNull: false
          },
          status: {
            type: DataTypes.ENUM,
            values: ['Pending', 'Approved', 'Denied'],
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


