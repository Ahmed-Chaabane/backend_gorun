const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DefiProgres = sequelize.define('DefiProgres', {
    id_defi: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    progres: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de progres ne peut pas être dans le futur.");
                }
            },
        },
    },
}, {
    tableName: 'defi_progres',
    timestamps: false,
});

module.exports = DefiProgres;