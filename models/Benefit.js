const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Benefits = sequelize.define('Benefits', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'benefits',
    timestamps: false,
});

module.exports = Benefits;
