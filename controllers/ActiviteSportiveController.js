const { body, validationResult } = require('express-validator');
const ActiviteSportive = require('../models/ActiviteSportive');

// Obtenir toutes les activités sportives
exports.getAllActivitesSportives = async (req, res) => {
    try {
        const activitesSportives = await ActiviteSportive.findAll();
        res.json(activitesSportives);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une activité sportive
exports.addActiviteSportive = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        type_activite,
        date_activite,
        duree_secondes,
        distance_km,
        calories_brulees,
        id_utilisateur,
        date_heure,
        donnees_specifiques,
        frequence_cardiaque_moyenne,
        vitesse_moyenne_kmh,
        altitude_max,
        denivele_positif,
        parcours,
        firebase_uid
    } = req.body;

    try {
        const nouvelleActivite = await ActiviteSportive.create({
            type_activite,
            date_activite,
            duree_secondes,
            distance_km,
            calories_brulees,
            id_utilisateur,
            date_heure,
            donnees_specifiques,
            frequence_cardiaque_moyenne,
            vitesse_moyenne_kmh,
            altitude_max,
            denivele_positif,
            parcours,
            firebase_uid
        });
        res.status(201).json(nouvelleActivite);
    } catch (err) {
        console.error("Erreur lors de la création de l'activité sportive :", err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'Contrainte unique violée', details: err.errors });
        } else if (err.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erreur de validation', details: err.errors });
        } else {
            res.status(500).json({
                error: "Erreur lors de l’enregistrement de l'activité sportive",
                details: err.message
            });
        }
    }
};

// Récupérer une activité sportive par ID
exports.getActiviteSportiveById = async (req, res) => {
    const { id_activite_sportive } = req.params;
    try {
        const activiteSportive = await ActiviteSportive.findByPk(id_activite_sportive);
        if (activiteSportive) {
            res.json(activiteSportive);
        } else {
            res.status(404).json({ error: 'Activité sportive non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l’activité sportive' });
    }
};

// Mettre à jour une activité sportive
exports.updateActiviteSportive = async (req, res) => {
    const { id_activite_sportive } = req.params;
    const {
        type_activite,
        date_activite,
        duree_secondes,
        distance_km,
        calories_brulees,
        id_utilisateur,
        date_heure,
        donnees_specifiques,
        frequence_cardiaque_moyenne,
        vitesse_moyenne_kmh,
        altitude_max,
        denivele_positif,
        parcours,
        firebase_uid
    } = req.body;

    try {
        const activiteSportive = await ActiviteSportive.findByPk(id_activite_sportive);
        if (activiteSportive) {
            await activiteSportive.update({
                type_activite,
                date_activite,
                duree_secondes,
                distance_km,
                calories_brulees,
                id_utilisateur,
                date_heure,
                donnees_specifiques,
                frequence_cardiaque_moyenne,
                vitesse_moyenne_kmh,
                altitude_max,
                denivele_positif,
                parcours,
                firebase_uid
            });
            res.json(activiteSportive);
        } else {
            res.status(404).json({ error: 'Activité sportive non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l’activité sportive' });
    }
};

// Supprimer une activité sportive
exports.deleteActivitesSportive = async (req, res) => {
    const { id_activite_sportive } = req.params;
    try {
        const activiteSportive = await ActiviteSportive.findByPk(id_activite_sportive);
        if (activiteSportive) {
            await activiteSportive.destroy();
            res.json({ message: 'Activité sportive supprimée avec succès' });
        } else {
            res.status(404).json({ error: 'Activité sportive non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l’activité sportive' });
    }
};

// Dans votre contrôleur (ActiviteSportiveController.js)
exports.getUserActivities = async (req, res) => {
    const { firebase_uid } = req.query;

    try {
        if (!firebase_uid) {
            return res.status(400).json({ error: 'Le paramètre firebase_uid est requis' });
        }

        const activites = await ActiviteSportive.findAll({
            where: { firebase_uid },
            order: [['date_activite', 'DESC']],
            raw: true
        });

        const formattedActivities = activites.map(activity => {
            // Conversion sécurisée des valeurs
            const distance = parseFloat(activity.distance_km) || 0;
            const speed = activity.vitesse_moyenne_kmh ? parseFloat(activity.vitesse_moyenne_kmh) : null;
            const heartRate = activity.frequence_cardiaque_moyenne ? parseInt(activity.frequence_cardiaque_moyenne) : null;

            // Conversion de la date
            const dateObj = activity.date_activite instanceof Date
                ? activity.date_activite
                : new Date(activity.date_activite);

            // Formatage de la durée
            const totalSeconds = parseInt(activity.duree_secondes) || 0;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            return {
                id: activity.id_activite_sportive,
                type: activity.type_activite,
                date: dateObj.toISOString().split('T')[0],
                duration: {
                    seconds: totalSeconds,
                    formatted: formattedDuration
                },
                distance: distance.toFixed(2),
                calories: parseInt(activity.calories_brulees) || 0,
                speed: speed ? speed.toFixed(1) : null,
                heart_rate: heartRate,
                created_at: activity.created_at
            };
        });

        res.status(200).json({
            success: true,
            count: formattedActivities.length,
            data: formattedActivities
        });

    } catch (error) {
        console.error('Erreur récupération activités:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
