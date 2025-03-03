const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProgressionObjectif = sequelize.define('ProgressionObjectif', {
    id_progression: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_objectif_sportif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'objectif_sportif', // Nom de la table référencée
            key: 'id_objectif_sportif'
        },
        onDelete: 'CASCADE' // Action lors de la suppression de l'entité parent
    },
    id_activite_sportive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'activite_sportive', // Nom de la table référencée
            key: 'id_activite_sportive'
        },
        onDelete: 'CASCADE' // Action lors de la suppression de l'entité parent
    },
    progression: {
        type: DataTypes.DECIMAL(5, 2), // Correspond à `numeric(5, 2)` en SQL
        allowNull: false,
        validate: {
            min: 0,
            max: 100 // Ajout d'une validation Sequelize pour respecter la contrainte `CHECK`
        }
    },
}, {
    tableName: 'progression_objectif',
    timestamps: false // Pas de colonnes `createdAt` et `updatedAt`
});

module.exports = ProgressionObjectif;