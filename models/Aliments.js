const {DataTypes} = require('sequelize');
sequalize = require('../config/database');

const Aliments = sequalize.define('Aliments', {
    id_aliment: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    calories: {
        type: DataTypes.DOUBLE,
        allowNull: false,

    },
    proteines: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    glucides: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    lipides: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

}, {
    tableName: 'aliments',
    timestamps: false
});

module.exports = Aliments;