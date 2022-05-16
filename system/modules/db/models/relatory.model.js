'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class relatorys extends Model {
        static associate(models) {
            relatorys.hasOne(models.users, {
                foreignKey: 'id',
                as: 'userId'
            })
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


