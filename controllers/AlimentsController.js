const express = require('express');
const {body, validationResult} = require('express-validator'); // validation de données
const Aliments = require('../models/Aliments'); // Importer le modèle DefiCommunautaire
const router = express.Router();

// Obtenir tous les aliments
exports.getAllAliments = async (req, res) => {
    try {
        const aliments = await Aliments.findAll(); // Récupérer tous les L
        res.json(aliments); // Retourner les defis au format JSON
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' }); // Si une erreur se produit, renvoyer une erreur 500
    }
};

// Ajouter un aliment
exports.addAliment = async (req, res) => {

    const errors = validationResult(req); // Récupérer les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); // Retourner les erreurs de validation
    }

    const {nom, calories, proteines, glucides, lipides} = req.body;
    try {
        const aliment = await Aliments.create({
            nom,
            calories,
            proteines,
            glucides,
            lipides
        });
        res.status(201).json(aliment); // Si l'ajout est réussi, renvoyer le aliment créé
    } catch (err) {
        console.error('Erreur Sequelize :', err); // aliment pour afficher l'erreur complète
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de aliment ', details: err.message }); // Inclure les détails de l'erreur
    }
};

// Récupérer un aliment par son ID
exports.getAlimentById = async (req, res) => {
    const { id_aliment } = req.params;
    try {
        const aliment = await Aliments.findByPk(id_aliment); // Chercher aliment par ID
        if (aliment) {
            res.json(aliment); // Retourner aliment
        } else {
            res.status(404).json({ error: 'aliment non trouvé' }); // Si aliment n'est pas trouvé
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un aliment
exports.updateAliment = async (req, res) => {
    const { id_aliment } = req.params;
    const { nom, calories, proteines, glucides, lipides } = req.body;
    try {
        const aliment = await Aliments.findByPk(id_aliment); // Chercher aliment par ID
        if (aliment) {
            await aliment.update({
                nom,
                calories,
                proteines,
                glucides,
                lipides
            });
            res.json(aliment); // Retourner aliment mis à jour
        } else {
            res.status(404).json({ error: 'aliment non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};

// Supprimer un aliment par son ID
exports.deleteAliment = async (req, res) => {
    const { id_aliment } = req.params;
    try {
        const aliment = await Aliments.findByPk(id_aliment);
        if (aliment) {
            await aliment.destroy(); // Supprimer le aliment
            res.json({ message: 'aliment supprimé' });
        } else {
            res.status(404).json({ error: 'aliment non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
