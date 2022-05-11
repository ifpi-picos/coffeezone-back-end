'use strict';

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
        }
    }

    user.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cardid: {
            type: DataTypes.STRING(10),
            allowNull: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        occupation: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        linkedin: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'user',
        paranoid: false,
        timestamps: false
    })

    return user
}