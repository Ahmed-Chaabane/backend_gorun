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
            model: 'ObjectifSportif',
            key: 'id_objectif_sportif',
        },
        onDelete: 'CASCADE',
    },
    niveau_difficulte: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'recommandation_entrainement',
    timestamps: false,
});

module.exports = RecommandationEntrainement;