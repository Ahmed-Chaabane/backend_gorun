const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommandationRecuperation = sequelize.define('RecommandationRecuperation', {
    id_recommandation: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    id_recuperation_blessure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'RecuperationBlessure',
            key: 'id_recuperation_blessure',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'recommandation_recuperation',
    timestamps: false,
});

module.exports = RecommandationRecuperation;
