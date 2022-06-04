'use strict';

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
        }
    }

    users.init({
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
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        occupation: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['Coordinator', 'Member', 'Visitor'],
        },
        linkedin: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        preferences: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {
                'sendActionRegEmail': true,
            }
        },
        profileimage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'users',
        paranoid: false,
        timestamps: false
    })

    return users
}