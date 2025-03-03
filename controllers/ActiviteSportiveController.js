const {body, validationResult} = require('express-validator'); // validation de données
const ActiviteSportive = require('../models/ActiviteSportive'); // Importer le modèle ActiviteSportive


// Obtenir toutes les activités sportives
exports.getAllActivitesSportives = async (req, res) => {
    try {
        const activitesSportives = await ActiviteSportive.findAll(); // Récupérer toutes les activités sportives
        res.json(activitesSportives); // Retourner les activités sportives au format JSON
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'}); // Si une erreur se produit, renvoyer une erreur 500
    }
}

// Ajouter une activité sportive
exports.addActiviteSportive = async (req, res) => {

    const errors = validationResult(req); // Récupérer les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); // Retourner les erreurs de validation
    }
    const {
        type_activite,
        date_activite,
        duree,
        distance,
        calories_brulees,
        id_utilisateur,
        id_objectif_sportif,
        latitude_debut,
        longitude_debut,
        latitude_fin,
        longitude_fin,
        details_raw,
        date_heure,
    } = req.body;
    try {
        const nouvelleActivite = await ActiviteSportive.create({
            type_activite,
            date_activite,
            duree,
            distance,
            calories_brulees,
            id_utilisateur,
            id_objectif_sportif,
            latitude_debut,
            longitude_debut,
            latitude_fin,
            longitude_fin,
            details_raw,
            date_heure
        });
        res.status(201).json(nouvelleActivite);
    } catch (err) {
        console.error('Erreur lors de la création de l\'activité sportive :', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({error: 'Contrainte unique violée', details: err.errors});
        } else if (err.name === 'SequelizeValidationError') {
            res.status(400).json({error: 'Erreur de validation', details: err.errors});
        } else {
            res.status(500).json({
                error: 'Erreur lors de l’enregistrement de l\'activité sportive',
                details: err.message
            });
        }
    }
};

// Récupérer une activité sportive par ID
exports.getActiviteSportiveById = async (req, res) => {
    const {id_activite_sportive} = req.params;
    try {
        const activiteSportive = await ActiviteSportive.findByPk(id_activite_sportive); // Chercher l'activité par ID
        if (activiteSportive) {
            res.json(activiteSportive);
        } else {
            res.status(404).json({error: 'Activité sportive non trouvée'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur lors de la récupération de l’activité sportive'});
    }
};

// Mettre à jour une activité sportive
exports.updateActiviteSportive = async (req, res) => {
    const {id_activite_sportive} = req.params;
    const {
        type_activite,
        date_activite,
        duree,
        distance,
        calories_brulees,
        id_utilisateur,
        id_objectif_sportif,
        latitude_debut,
        longitude_debut,
        latitude_fin,
        longitude_fin,
        details_raw,
        date_heure,
    } = req.body;
    try {
        const activiteSportive = await ActiviteSportive.findByPk(id_activite_sportive);
        if (activiteSportive) {
            await activiteSportive.update({
                type_activite,
                date_activite,
                duree,
                distance,
                calories_brulees,
                id_utilisateur,
                id_objectif_sportif,
                latitude_debut,
                longitude_debut,
                latitude_fin,
                longitude_fin,
                details_raw,
                date_heure
            });
            res.json(activiteSportive); // Retourner l'activité mise à jour
        } else {
            res.status(404).json({error: 'Activité sportive non trouvée'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de la mise à jour de l’activité sportive'});
    }
};

// Supprimer une activité sportive
exports.deleteActivitesSportive = async (req, res) => {
    const {id_activite_sportive} = req.params;
    try {
        const activiteSportive = await ActiviteSportive.findByPk(id_activite_sportive);
        if (activiteSportive) {
            await activiteSportive.destroy(); // Supprimer l'activité sportive
            res.json({message: 'Activité sportive supprimée avec succès'});
        } else {
            res.status(404).json({error: 'Activité sportive non trouvée'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de la suppression de l’activité sportive'});
    }
};
