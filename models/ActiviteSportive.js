const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActiviteSportive = sequelize.define('ActiviteSportive', {
    id_activite_sportive: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type_activite: {
        type: DataTypes.ENUM('running', 'cycling'), // adapte selon ton ENUM PostgreSQL
        allowNull: false,
    },
    date_activite: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isNotFuture(value) {
                if (new Date(value) > new Date(Date.now() + 24 * 60 * 60 * 1000)) {
                    throw new Error("La date de l'activité ne peut pas être dans le futur.");
                }
            },
        },
    },
    duree_secondes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: "La durée doit être supérieure à 0 secondes.",
            },
        },
    },
    distance_km: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "La distance doit être positive.",
            },
        },
    },
    calories_brulees: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "Les calories brûlées doivent être positives.",
            },
        },
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'id_utilisateur',
        },
        onDelete: 'CASCADE',
    },
    donnees_specifiques: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    date_heure: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    frequence_cardiaque_moyenne: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [1],
                msg: "La fréquence cardiaque doit être positive.",
            },
        },
    },
    vitesse_moyenne_kmh: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "La vitesse moyenne doit être positive.",
            },
        },
    },
    altitude_max: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
    },
    denivele_positif: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "Le dénivelé positif doit être positif.",
            },
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    parcours: {
        type: DataTypes.GEOMETRY('LINESTRING', 4326),
        allowNull: true,
    },
    firebase_uid: {
        type: DataTypes.TEXT,
        allowNull: true,
        references: {
            model: 'utilisateur',
            key: 'firebase_uid',
        },
    },
}, {
    tableName: 'activite_sportive',
    timestamps: false,
    underscored: true,
});

module.exports = ActiviteSportive;
