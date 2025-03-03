const { body, validationResult } = require('express-validator');
const RecuperationBlessure = require('../models/RecuperationBlessure');


// Obtenir tous les Recuperation Blessure
exports.getAllRecuperationBlessure = async (req, res) => {
    try {
        const blessures = await RecuperationBlessure.findAll();
        res.json(blessures);
    } catch (err) {
        console.error('Erreur lors de la récupération des blessures', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une Recuperation Blessure
exports.addRecuperationBlessure = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { type_blessure, date_blessure, id_utilisateur, niveau_gravite, statut } = req.body;
    try {
        const blessure = await RecuperationBlessure.create({
            type_blessure,
            date_blessure,
            id_utilisateur,
            niveau_gravite,
            statut
        });
        res.status(201).json(blessure);
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement de la blessure', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de la blessure', details: err.message });
    }
};

// Récupérer une blessure par son ID
exports.getRecuperationBlessureById = async (req, res) => {
    const { id_recuperation_blessure } = req.params;
    try {
        const blessure = await RecuperationBlessure.findByPk(id_recuperation_blessure);
        if (blessure) {
            res.json(blessure);
        } else {
            res.status(404).json({ error: 'Blessure non trouvée' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération de la blessure', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour une blessure
exports.updateRecuperationBlessure = async (req, res) => {
    const { id_recuperation_blessure } = req.params;
    const { type_blessure, date_blessure, id_utilisateur, niveau_gravite, statut } = req.body;
    try {
        const blessure = await RecuperationBlessure.findByPk(id_recuperation_blessure);
        if (blessure) {
            await blessure.update({
                type_blessure,
                date_blessure,
                id_utilisateur,
                niveau_gravite,
                statut
            });
            res.json(blessure);
        } else {
            res.status(404).json({ error: 'Blessure non trouvée' });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour de la blessure', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer une blessure
exports.deleteRecuperationBlessure = async (req, res) => {
    const { id_recuperation_blessure } = req.params;
    try {
        const blessure = await RecuperationBlessure.findByPk(id_recuperation_blessure);
        if (blessure) {
            await blessure.destroy();
            res.json({ message: 'Blessure supprimée' });
        } else {
            res.status(404).json({ error: 'Blessure non trouvée' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression de la blessure', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};