const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NutritionGoal = sequelize.define('NutritionGoal', {
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
    required_meals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3, // Valeur par défaut pour les repas requis
        validate: {
            min: 1, // Minimum 1 repas requis
            max: 20, // Maximum 20 repas requis
        },
    },
}, {
    tableName: 'nutrition_goals', // Nom de la table dans la base de données
    timestamps: false, // Désactiver les champs `createdAt` et `updatedAt`
});

module.exports = NutritionGoal;