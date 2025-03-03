const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetailActiviteSportive = sequelize.define('DetailActiviteSportive', {
    id_detail_activite: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_activite_sportive: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'activite_sportive',
            key: 'id_activite_sportive'
        },
        onDelete: 'CASCADE'
    },
    moment: {
        type: DataTypes.DATE,
        allowNull: false
    },
    intensite: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    localisation: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true
    },
}, {
    tableName: 'detail_activite_sportive',
    timestamps: false
});

module.exports = DetailActiviteSportive;
