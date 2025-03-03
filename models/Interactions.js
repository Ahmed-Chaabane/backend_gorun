const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interaction = sequelize.define('Interaction', {
    id_interaction: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateur', // Nom de la table référencée
            key: 'id_utilisateur'
        },
        onDelete: 'CASCADE'
    },
    type_interaction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['like', 'comment']] // Validation pour les valeurs autorisées
        }
    },
    id_defi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'defi_communautaire', // Nom de la table référencée
            key: 'id_defi'
        },
        onDelete: 'CASCADE'
    },
    commentaire: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date_interaction: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Définit la valeur par défaut à `CURRENT_TIMESTAMP`
    }
}, {
    tableName: 'interactions',
    timestamps: false
});

module.exports = Interaction;