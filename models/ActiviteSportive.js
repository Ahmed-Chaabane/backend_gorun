const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActiviteSportive = sequelize.define('ActiviteSportive', {
    id_activite_sportive: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type_activite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_activite: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de l'activité ne peut pas être dans le futur.");
                }
            },
        },
    },
    duree: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "La durée doit être supérieure à 0.",
            },
        },
    },
    distance: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "La distance doit être supérieure ou égale à 0.",
            },
        },
    },
    calories_brulees: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "Les calories brûlées doivent être supérieures ou égales à 0.",
            },
        },
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Utilisateur',
            key: 'id_utilisateur',
        },
        onDelete: 'CASCADE',
    },
    id_objectif_sportif: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'ObjectifSportif',
            key: 'id_objectif_sportif',
        },
        onDelete: 'SET NULL',
    },
    latitude_debut: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            min: {
                args: [-90],
                msg: "La latitude doit être supérieure ou égale à -90.",
            },
            max: {
                args: [90],
                msg: "La latitude doit être inférieure ou égale à 90.",
            },
        },
    },
    longitude_debut: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            min: {
                args: [-180],
                msg: "La longitude doit être supérieure ou égale à -180.",
            },
            max: {
                args: [180],
                msg: "La longitude doit être inférieure ou égale à 180.",
            },
        },
    },
    latitude_fin: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            min: {
                args: [-90],
                msg: "La latitude doit être supérieure ou égale à -90.",
            },
            max: {
                args: [90],
                msg: "La latitude doit être inférieure ou égale à 90.",
            },
        },
    },
    longitude_fin: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            min: {
                args: [-180],
                msg: "La longitude doit être supérieure ou égale à -180.",
            },
            max: {
                args: [180],
                msg: "La longitude doit être inférieure ou égale à 180.",
            },
        },
    },
    details_raw:{
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isJSON: function(value) {
                try {
                    JSON.parse(value);
                } catch (error) {
                    throw new Error("Les détails de l'activité sportive doivent être au format JSON.");
                }
            }
        }
    },
    date_heure:{
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isBeforeToday(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("La date de l'activité ne peut pas être dans le futur.");
                }
            },
        },
    },
}, {
    tableName: 'activite_sportive',
    timestamps: false,
});

module.exports = ActiviteSportive;