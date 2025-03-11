const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const DefiParticipants = require('./DefiParticipants');

const DefiCommunautaire = sequelize.define('DefiCommunautaire', {
    id_defi_communautaire: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom_defi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_debut: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de début du défi ne peut pas être dans le futur.");
                }
            },
        },
    },
    date_fin: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de fin du défi ne peut pas être dans le futur.");
                }
            },
        },
    },
    participants: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recompense: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    progression: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 1,
        },
    },
}, {
    tableName: 'defi_communautaire',
    timestamps: false,
});

module.exports = DefiCommunautaire;