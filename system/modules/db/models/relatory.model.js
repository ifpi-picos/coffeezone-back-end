'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class relatorys extends Model {
        static associate(models) {
        }
    }

    relatorys.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        actions: {
            type: DataTypes.JSON,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'relatorys',
        paranoid: false,
        timestamps: false
    })

    return relatorys
}


