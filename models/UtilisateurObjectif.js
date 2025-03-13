const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UtilisateurObjectif = sequelize.define(
    'UtilisateurObjectif',
    {
        id_utilisateur_objectif: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_utilisateur: {
            type: DataTypes.INTEGER, // ou DataTypes.STRING selon votre choix
            allowNull: false,
            references: {
                model: 'utilisateur', // Si l'ID utilisateur est un entier
                key: 'id_utilisateur',
            },
            onDelete: 'CASCADE',
        },
        id_objectif_sportif: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'objectif_sportif',
                key: 'id_objectif_sportif',
            },
            onDelete: 'CASCADE',
        },
        firebase_uid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'utilisateur',
                key: 'firebase_uid',
            },
            onDelete: 'CASCADE',
        },
        date_debut: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        date_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        etat: {
            type: DataTypes.ENUM('progress', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'en cours',
        },
    },
    {
        tableName: 'utilisateur_objectif',
        timestamps: false,
    }
);

module.exports = UtilisateurObjectif;
