const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommandationEntrainement = sequelize.define('RecommandationEntrainement', {
    id_recommandation_entrainement: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    id_objectif_sportif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ObjectifSportif', // Nom de la table 'objectif_sportif' doit être exact
            key: 'id_objectif_sportif',
        },
        onDelete: 'CASCADE',
    },
    niveau_difficulte: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duree_seance: {
        type: DataTypes.INTEGER,
        allowNull: true, // Peut être nul si non défini
    },
    frequence: {
        type: DataTypes.TEXT,
        allowNull: true, // Peut être nul si non défini
    },
    jours: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true, // Peut être nul si non défini
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true, // Peut être nul si non défini
    },
    exercices: {
        type: DataTypes.JSONB,
        allowNull: true, // Peut être nul si non défini
    },
    // Ajout des nouvelles colonnes pour l'utilisateur
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false, // La clé étrangère id_utilisateur doit être obligatoirement remplie
        references: {
            model: 'Utilisateur', // Nom de la table 'utilisateur' doit être exact
            key: 'id_utilisateur', // Colonne sur laquelle la clé étrangère fait référence
        },
        onDelete: 'CASCADE', // Supprimer les recommandations si l'utilisateur est supprimé
    },
    firebase_uid: {
        type: DataTypes.STRING, // Firebase UID est une chaîne de caractères
        allowNull: false,
        references: {
            model: 'Utilisateur', // Nom de la table 'utilisateur' doit être exact
            key: 'firebase_uid', // Colonne sur laquelle la clé étrangère fait référence
        },
        onDelete: 'CASCADE', // Supprimer les recommandations si l'utilisateur est supprimé
    },
}, {
    tableName: 'recommandation_entrainement',
    timestamps: false, // Pas de colonnes 'createdAt' et 'updatedAt'
});

module.exports = RecommandationEntrainement;
