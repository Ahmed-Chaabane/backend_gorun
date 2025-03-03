const { body, validationResult } = require('express-validator');
const ObjectifSportif = require('../models/ObjectifSportif');

// Obtenir tous les Objectifs Sportifs
exports.getAllObjectifSportif = async (req, res) => {
    try {
        const objectifs = await ObjectifSportif.findAll(); // Récupérer tous les Objectifs Sportifs
        res.json(objectifs); // Retourner les objectifs au format JSON
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' }); // Si une erreur se produit, renvoyer une erreur 500
    }
};

// Ajouter un Objectif Sportif
exports.addObjectifSportif = async (req, res) => {
    const errors = validationResult(req); // Récupérer les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Retourner les erreurs de validation
    }

    const { description, date_debut, date_fin, id_utilisateur, etat } = req.body;
    try {
        const objectifsportif = await ObjectifSportif.create({
            description,
            date_debut,
            date_fin,
            id_utilisateur,
            etat
        });
        res.status(201).json(objectifsportif); // Si l'ajout est réussi, renvoyer l'Objectif Sportif créé
    } catch (err) {
        console.error('Erreur Sequelize :', err); // Log pour afficher l'erreur complète
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de l\'Objectif Sportif', details: err.message }); // Inclure les détails de l'erreur
    }
};

// Récupérer un Objectif Sportif par son ID
exports.getObjectifSportifById = async (req, res) => {
    const { id_objectif_sportif } = req.params;
    try {
        const objectifsportif = await ObjectifSportif.findByPk(id_objectif_sportif); // Chercher l'Objectif Sportif par ID
        if (objectifsportif) {
            res.json(objectifsportif); // Retourner l'Objectif Sportif
        } else {
            res.status(404).json({ error: 'Objectif Sportif non trouvé' }); // Si l'Objectif Sportif n'est pas trouvé
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un Objectif Sportif
exports.updateObjectifSportif = async (req, res) => { // Correction de la route : rajout du paramètre ':id_objectif_sportif'
    const { id_objectif_sportif } = req.params; // Extraction de l'ID dans les paramètres de la route
    const { description, date_debut, date_fin, id_utilisateur, etat } = req.body;

    try {
        const objectifsportif = await ObjectifSportif.findByPk(id_objectif_sportif);
        if (objectifsportif) {
            // Mise à jour des données
            await objectifsportif.update({
                description,
                date_debut,
                date_fin,
                id_utilisateur,
                etat
            });
            res.json(objectifsportif); // Retourner l'Objectif Sportif mis à jour
        } else {
            res.status(404).json({ error: 'Objectif Sportif non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un Objectif Sportif
exports.deleteObjectifSportif = async (req, res) => {
    const { id_objectif_sportif } = req.params;
    try {
        const objectifsportif = await ObjectifSportif.findByPk(id_objectif_sportif);
        if (objectifsportif) {
            await objectifsportif.destroy(); // Supprimer l'Objectif Sportif
            res.json({ message: 'Objectif Sportif supprimé' });
        } else {
            res.status(404).json({ error: 'Objectif Sportif non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};