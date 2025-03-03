const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Evenement = sequelize.define('Evenement', {
    id_evenement: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date_debut: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_createur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'id_utilisateur'
        },
        onDelete: 'CASCADE'
    },
}, {
    tableName: 'evenement',
    timestamps: false
});

module.exports = Evenement;
