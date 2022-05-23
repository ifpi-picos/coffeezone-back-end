'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class equipments extends Model {
        static associate(models) {
        }
    }

    equipments.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.TEXT(2048),
            allowNull: false
        },
        status: {
            type: DataTypes.TEXT(2048),
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'equipments',
        paranoid: false,
        timestamps: false
    })

    return equipments
}


