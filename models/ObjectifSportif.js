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
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_debut: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfterToday(value) {
                    if (new Date(value) < new Date()) {
                        throw new Error("La date de début de l'objectif sportif doit être dans le futur.");
                    }
                },
            },
        },
        date_fin: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfterToday(value) {
                    if (new Date(value) < new Date()) {
                        throw new Error("La date de fin de l'objectif sportif doit être dans le futur.");
                    }
                },
            },
        },
        id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
            references: {
                model: 'Utilisateur',
                key: 'id_utilisateur',
            },
        },
        etat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'objectif_sportif',
        timestamps: false,
        validate: {
            dateFinSuperieureDateDebut() {
                if (new Date(this.date_fin) <= new Date(this.date_debut)) {
                    throw new Error("La date de fin doit être postérieure à la date de début.");
                }
            },
        },
    }
);

module.exports = ObjectifSportif;
