const express = require('express');
const { body, validationResult } = require('express-validator');
const DetailActiviteSportive = require('../models/DetailActiviteSportive');
router = express.Router();

// Obtenir tous les détails des activités sportives
exports.getAllDetailActiviteSportiveController =async (req, res) => {
    try {
        const details = await DetailActiviteSportive.findAll({ order: [['id_detail_activite', 'ASC']] });
        res.json(details);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un détail d'activité sportive
exports.addDetailActiviteSportiveController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id_activite_sportive, moment, intensite, location } = req.body;
    try {
        const newDetail = await DetailActiviteSportive.create({
            id_activite_sportive,
            moment,
            intensite,
            location
        });
        res.status(201).json(newDetail);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement du détail d\'activité sportive', details: err.message });
    }
};

// Récupérer un détail d'activité sportive par son ID
exports.getDetailActiviteSportiveByIdController = async (req, res) => {
    const { id_detail_activite } = req.params;
    try {
        const detail = await DetailActiviteSportive.findByPk(id_detail_activite);
        if (detail) {
            res.json(detail);
        } else {
            res.status(404).json({ error: 'Détail d\'activité sportive non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un détail d'activité sportive
exports.updateDetailActiviteSportiveController = async (req, res) => {
    const { id_detail_activite } = req.params;
    const { id_activite_sportive, moment, intensite, location } = req.body;
    try {
        const detail = await DetailActiviteSportive.findByPk(id_detail_activite);
        if (detail) {
            await detail.update({
                id_activite_sportive,
                moment,
                intensite,
                location
            });
            res.json(detail);
        } else {
            res.status(404).json({ error: 'Détail d\'activité sportive non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un détail d'activité sportive
exports.deleteDetailActiviteSportiveController = async (req, res) => {
    const { id_detail_activite } = req.params;
    try {
        const detail = await DetailActiviteSportive.findByPk(id_detail_activite);
        if (detail) {
            await detail.destroy();
            res.json({ message: 'Détail d\'activité sportive supprimé' });
        } else {
            res.status(404).json({ error: 'Détail d\'activité sportive non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
