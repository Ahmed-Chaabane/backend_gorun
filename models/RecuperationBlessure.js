const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecuperationBlessure = sequelize.define('RecuperationBlessure', {
    id_recuperation_blessure: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type_blessure: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_blessure: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de blessure ne peut pas être dans le futur.");
                }
            },
        },
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateur',
            key: 'id_utilisateur',
        },
        onDelete: 'CASCADE',
    },
    niveau_gravite: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    statut: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'recuperation_blessure',
    timestamps: false,
});

module.exports = RecuperationBlessure;
