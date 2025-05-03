const { validationResult } = require('express-validator');
const Benefits = require('../models/Benefit'); // Importer le modèle Benefits
// ➤ Obtenir tous les benefits
exports.getAllBenefits = async (req, res) => {
    try {
        const benefits = await Benefits.findAll(); // Récupérer tous les benefits
        res.json(benefits); // Retourner les benefits au format JSON
    } catch (err) {
        console.error('Erreur lors de la récupération des benefits :', err); // Logue l'erreur
        res.status(500).json({ error: 'Erreur serveur', details: err.message }); // Détails supplémentaires
    }
};
// ➤ Ajouter un benefit
exports.addBenefit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, icon } = req.body;
    try {
        const benefit = await Benefits.create({
            name,
            icon
        });
        res.status(201).json(benefit);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({
            error: 'Erreur lors de l’enregistrement du benefit',
            details: err.message
        });
    }
};

// ➤ Récupérer un benefit par ID
exports.getBenefitById = async (req, res) => {
    const { id_benefit } = req.params;
    try {
        const benefit = await Benefits.findByPk(id);
        if (benefit) {
            res.json(benefit);
        } else {
            res.status(404).json({ error: 'Benefit non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ➤ Mettre à jour un benefit
exports.updateBenefit = async (req, res) => {
    const { id } = req.params;
    const { name, icon } = req.body;
    try {
        const benefit = await Benefits.findByPk(id);
        if (benefit) {
            await benefit.update({ name, icon });
            res.json(benefit);
        } else {
            res.status(404).json({ error: 'Benefit non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};

// ➤ Supprimer un benefit
exports.deleteBenefit = async (req, res) => {
    const { id } = req.params;
    try {
        const benefit = await Benefits.findByPk(id);
        if (benefit) {
            await benefit.destroy();
            res.json({ message: 'Benefit supprimé' });
        } else {
            res.status(404).json({ error: 'Benefit non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};