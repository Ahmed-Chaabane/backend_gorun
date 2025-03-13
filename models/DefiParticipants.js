const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const DefiCommunautaire = require('./DefiCommunautaire');

const DefiParticipants = sequelize.define('DefiParticipants', {
    id_defi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firebase_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'firebase_uid',
        },
    },
    id_utilisateur: { // Ajout de cette colonne
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'id_utilisateur',
        },
    },
    progression: {
        type: DataTypes.REAL,
        allowNull: false,
        validate: {
            min: 0,
            max: 1,
        },
    },
    statut: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    id_defi_communautaire: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'defi_communautaire',
            key: 'id_defi_communautaire',
        },
    },
}, {
    tableName: 'defi_participants',
    timestamps: false,
});


module.exports = DefiParticipants;
