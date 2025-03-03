const { body, validationResult } = require('express-validator'); // Validation de données
const RecommandationRecuperation = require('../models/RecommandationRecuperation'); // Importer le modèle


// Obtenir toutes les recommandations de récupération
exports.getRecommandationRecuperation = async (req, res) => {
    try {
        const recuperations = await RecommandationRecuperation.findAll(); // Récupérer toutes les recommandations
        res.json(recuperations); // Retourner les recommandations au format JSON
    } catch (err) {
        console.error('Erreur lors de la récupération :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une recommandation de récupération
exports.addRecommandationRecuperation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { description, id_recuperation_blessure } = req.body;
    try {
        const recuperation = await RecommandationRecuperation.create({ description, id_recuperation_blessure });
        res.status(201).json(recuperation);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement', details: err.message });
    }
};

// Récupérer une recommandation par son ID
exports.getRecommandationRecuperationById = async (req, res) => {
    const { id_recommandation } = req.params;
    try {
        const recuperation = await RecommandationRecuperation.findByPk(id_recommandation);
        if (recuperation) {
            res.json(recuperation);
        } else {
            res.status(404).json({ error: 'Recommandation non trouvée' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour une recommandation
exports.updateRecommandationRecuperation = async (req, res) => {
    const { id_recommandation } = req.params;
    const { description, id_recuperation_blessure } = req.body;
    try {
        const recuperation = await RecommandationRecuperation.findByPk(id_recommandation);
        if (recuperation) {
            await recuperation.update({ description, id_recuperation_blessure });
            res.json(recuperation);
        } else {
            res.status(404).json({ error: 'Recommandation non trouvée' });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer une recommandation
exports.deleteRecommandationRecuperation = async (req, res) => {
    const { id_recommandation } = req.params;
    try {
        const recuperation = await RecommandationRecuperation.findByPk(id_recommandation);
        if (recuperation) {
            await recuperation.destroy();
            res.json({ message: 'Recommandation supprimée' });
        } else {
            res.status(404).json({ error: 'Recommandation non trouvée' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
