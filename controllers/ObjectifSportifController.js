const { validationResult } = require('express-validator');
const ObjectifSportif = require('../models/ObjectifSportif');

// Obtenir tous les objectifs sportifs
exports.getAllObjectifSportif = async (req, res) => {
    try {
        const objectifs = await ObjectifSportif.findAll(); // Récupérer tous les objectifs
        res.json(objectifs); // Réponse JSON
    } catch (err) {
        console.error('Erreur lors de la récupération des objectifs :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un objectif sportif
exports.addObjectifSportif = async (req, res) => {
    const errors = validationResult(req); // Vérifier les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Retourner les erreurs
    }

    const { description, name, icon } = req.body;
    try {
        const nouvelObjectif = await ObjectifSportif.create({
            description,
            name,
            icon,
        });
        res.status(201).json(nouvelObjectif); // Réponse avec l'objectif créé
    } catch (err) {
        console.error('Erreur lors de la création de l\'objectif :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer un objectif sportif par ID
exports.getObjectifSportifById = async (req, res) => {
    const { id_objectif_sportif } = req.params; // ID depuis les paramètres de la route
    try {
        const objectif = await ObjectifSportif.findByPk(id_objectif_sportif); // Rechercher par ID
        if (objectif) {
            res.json(objectif); // Réponse JSON
        } else {
            res.status(404).json({ error: 'Objectif sportif non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la recherche de l\'objectif :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un objectif sportif
exports.updateObjectifSportif = async (req, res) => {
    const { id_objectif_sportif } = req.params; // ID depuis les paramètres de la route
    const { description, name, icon } = req.body;

    const errors = validationResult(req); // Vérifier les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Retourner les erreurs
    }

    try {
        const objectif = await ObjectifSportif.findByPk(id_objectif_sportif); // Rechercher par ID
        if (objectif) {
            // Mise à jour des données
            await objectif.update({
                description,
                name,
                icon,
            });
            res.json(objectif); // Réponse JSON
        } else {
            res.status(404).json({ error: 'Objectif sportif non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'objectif :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un objectif sportif
exports.deleteObjectifSportif = async (req, res) => {
    const { id_objectif_sportif } = req.params; // ID depuis les paramètres de la route
    try {
        const objectif = await ObjectifSportif.findByPk(id_objectif_sportif); // Rechercher par ID
        if (objectif) {
            await objectif.destroy(); // Supprimer l'objectif
            res.json({ message: 'Objectif sportif supprimé avec succès' });
        } else {
            res.status(404).json({ error: 'Objectif sportif non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'objectif :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
