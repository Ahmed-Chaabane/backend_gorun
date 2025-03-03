const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DefiParticipants = sequelize.define('DefiParticipants', {
    id_defi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'DefiCommunautaire',
            key: 'id_defi_communautaire',
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateur',
            key: 'id_utilisateur',
        },
        onDelete: 'CASCADE',
        primaryKey: true
    },
}, {
    tableName: 'defi_participants',
    timestamps: false,
    primaryKey: ['id_defi', 'id_utilisateur'],
});

module.exports = DefiParticipants;