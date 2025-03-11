// models/SleepGoal.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que cette configuration est correcte

const SleepGoal = sequelize.define('SleepGoal', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    required_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quality_goal: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sport_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
}, {
    tableName: 'sleep_goals',
    timestamps: false, // Ajoute automatiquement `created_at` et `updated_at`
});

module.exports = SleepGoal;