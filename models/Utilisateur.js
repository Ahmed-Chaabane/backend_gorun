const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

// Définition du modèle Utilisateur
const Utilisateur = sequelize.define('Utilisateur', {
    id_utilisateur: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    taille: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        }
    },
    poids: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    date_naissance: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isBefore: new Date().toISOString(),
        }
    },
    date_inscription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    statut: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    sexe: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firebase_uid: {
        type: DataTypes.STRING,
        unique: true,
    },
    selectedSports: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'selectedsports', // Make sure this matches the column name in the database
    },
    preferences_sportives: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'preferences_sportives', // Make sure this matches the column name in the database
    },
    lieux_pratique: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'lieux_pratique', // Make sure this matches the column name in the database
    },
    frequence_entrainement: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    health_conditions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'health_conditions', // Make sure this matches the column name in the database
    },

    regime_alimentaire: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    objectifs_amelioration: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'objectifs_amelioration',
    },

}, {
    tableName: 'utilisateur',
    timestamps: false,
});


module.exports = Utilisateur;
