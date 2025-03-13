const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ObjectifSportif = sequelize.define(
    'ObjectifSportif',
    {
        id_objectif_sportif: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'objectif_sportif', // Nom de la table dans la base de données
        timestamps: false, // Désactiver les champs createdAt et updatedAt
    }
);

module.exports = ObjectifSportif;