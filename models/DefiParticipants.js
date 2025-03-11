const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const DefiCommunautaire = require('./DefiCommunautaire');

const DefiParticipants = sequelize.define('DefiParticipants', {
    id_defi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // `autoIncrement` pour la clé primaire
    },
    firebase_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'firebase_uid',
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
        allowNull: false,  // Doit être non nul car c'est une FK
        references: {
            model: 'defi_communautaire', // Table de référence
            key: 'id_defi_communautaire', // Clé primaire de la table `defi_communautaire`
        },
    },
}, {
    tableName: 'defi_participants',
    timestamps: false, // Pas de timestamps pour cette table
});

module.exports = DefiParticipants;
