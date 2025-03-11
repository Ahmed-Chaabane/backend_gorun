const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assurez-vous que le chemin est correct

const UtilisateurHydration = sequelize.define('UtilisateurHydration', {
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_hydration_goal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    firebase_uid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    progression: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    statut: {
        type: DataTypes.STRING,
        defaultValue: 'in progress',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},
    {
        tableName : 'utilisateur_hydration',
        timestamps: false
    });

module.exports = UtilisateurHydration;