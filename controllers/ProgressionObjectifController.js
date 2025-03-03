const { body, validationResult } = require('express-validator'); // Validation des données
const ProgressionObjectif = require('../models/ProgressionObjectif');
const DefiParticipants = require("../models/DefiParticipants"); // Importer le modèle ProgressionObjectif

// Obtenir tous les ProgressionObjectif
exports.getAllProgressionObjectif= async (req, res) => {
    try {
        const objectifs = await ProgressionObjectif.findAll();
        if (objectifs.length > 0) {
            res.status(200).json(objectifs);
        } else {
            res.status(404).json({ error: 'Aucun participant trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        res.status(400).json({
            error: 'Erreur serveur',
            details: error.message,
        });
    }
};

// Ajouter un ProgressionObjectif
exports.addProgressionObjectif = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id_objectif_sportif, id_activite_sportive, progression } = req.body;
    try {
        const newObjectif = await ProgressionObjectif.create({
            id_objectif_sportif,
            id_activite_sportive,
            progression,
        });
        res.status(201).json(newObjectif);
    } catch (err) {
        res.status(400).json({ error: 'Erreur lors de la création de l\'objectif', details: err.message });
    }
};

// Récupérer un ProgressionObjectif par son ID
exports.getProgressionObjectifById = async (req, res) => {
    const { id } = req.params;
    try {
        const objectif = await ProgressionObjectif.findByPk(id);
        if (objectif) {
            res.json(objectif);
        } else {
            res.status(404).json({ error: 'Objectif non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un ProgressionObjectif
exports.updateProgressionObjectif = async (req, res) => {
    const { id } = req.params;
    const { id_objectif_sportif, id_activite_sportive, progression } = req.body;

    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const objectifToUpdate = await ProgressionObjectif.findByPk(id);
        if (objectifToUpdate) {
            await objectifToUpdate.update({
                id_objectif_sportif,
                id_activite_sportive,
                progression
            });
            res.json(objectifToUpdate);
        } else {
            res.status(404).json({ error: 'Objectif non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un ProgressionObjectif
exports.deleteProgressionObjectif = async (req, res) => {
    const { id } = req.params;
    try {
        const objectifToDelete = await ProgressionObjectif.findByPk(id);
        if (objectifToDelete) {
            await objectifToDelete.destroy();
            res.json({ message: 'Objectif supprimé' });
        } else {
            res.status(404).json({ error: 'Objectif non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};