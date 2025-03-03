const express = require('express');
const { body, validationResult } = require('express-validator');
const Interaction = require('../models/Interactions');
const router = express.Router();


// Obtenir toutes les Interactions
exports.getAllInteractions = async (req, res) => {
    try {
        const interactions = await Interaction.findAll();
        res.json(interactions);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une Interaction
exports.addInteraction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id_utilisateur, type_interaction, id_defi, commentaire, date_interaction } = req.body;
    try {
        const interaction = await Interaction.create({
            id_utilisateur,
            type_interaction,
            id_defi,
            commentaire,
            date_interaction
        });
        res.status(201).json(interaction);
    } catch (err) {
        res.status(400).json({ error: 'Erreur lors de la création de l\'interaction', details: err.message });
    }
};

// Récupérer une Interaction par son ID
exports.getAllInteractionById = async (req, res) => {
    const { id_interaction } = req.params;
    try {
        const interaction = await Interaction.findByPk(id_interaction);
        if (interaction) {
            res.json(interaction);
        } else {
            res.status(404).json({ error: 'Interaction non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour une Interaction
exports.updateInteraction = async (req, res) => {
    const { id_interaction } = req.params;
    const { id_utilisateur, type_interaction, id_defi, commentaire, date_interaction } = req.body;
    try {
        const interactionToUpdate = await Interaction.findByPk(id_interaction);
        if (interactionToUpdate) {
            await interactionToUpdate.update({
                id_utilisateur,
                type_interaction,
                id_defi,
                commentaire,
                date_interaction
            });
            res.json(interactionToUpdate);
        } else {
            res.status(404).json({ error: 'Interaction non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer une Interaction
exports. deleteInteraction = async (req, res) => {
    const { id_interaction } = req.params;
    try {
        const interactionToDelete = await Interaction.findByPk(id_interaction);
        if (interactionToDelete) {
            await interactionToDelete.destroy();
            res.json({ message: 'Interaction supprimée' });
        } else {
            res.status(404).json({ error: 'Interaction non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};