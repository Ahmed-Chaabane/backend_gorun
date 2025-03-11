const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HydrationGoal = sequelize.define('HydrationGoal', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    required_glasses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 8,
        validate: {
            min: 1,
            max: 20,
        },
    },
}, {
    tableName: 'hydration_goals',
    timestamps: false,
});

module.exports = HydrationGoal;
