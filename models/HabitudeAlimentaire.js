const {DataTypes} = require('sequelize');
sequelize = require('../config/database');

const HabitudeAlimentaire = sequelize.define('HabitudeAlimentaire', {

    id_habitude_alimentaire: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type_aliment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantite: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "La quantité doit être supérieure à 0.",
            },
        },
    },
    date_habitude_alimentaire: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de l'habitude alimentaire ne peut pas être dans le futur.");
                }
            },
        },
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'Utilisateur',
            key: 'id_utilisateur',
        }
    },
    id_aliment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'Aliment',
            key: 'id_aliment',
        }
    },
}, {
    tableName: 'habitude_alimentaire',
    timestamps: false,
});
module.exports = HabitudeAlimentaire;