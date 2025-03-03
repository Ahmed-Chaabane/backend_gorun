const express = require('express');
const { body, validationResult } = require('express-validator');
const Evenement = require('../models/Evenement');
router = express.Router();

// Obtenir tous les evenements
exports.getAllEvenements = async (req, res) => {
    try {
        const evenements = await Evenement.findAll({ order: [['date_debut', 'ASC']] });
        res.json(evenements);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un evenement
exports.addEvenement = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {nom, description,date_debut,date_fin,id_createur} = req.body;
    try{
        const evenement = await Evenement.create({
            nom,
            description,
            date_debut,
            date_fin,
            id_createur
        });
        res.status(201).json(evenement);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de l\'evenement', details: err.message });
    }
};

// Récupérer un evenement par son ID
exports.getEvenementById = async(req, res) => {
    const {id_evenement} = req.params;
    try {
        const evenement = await Evenement.findByPk(id_evenement);
        if (evenement) {
            res.json(evenement);
        } else {
            res.status(404).json({ error: 'Evenement non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un evenement
exports.updateEvenement = async(req, res) => {
    const {id_evenement} = req.params;
    const {nom, description,date_debut,date_fin,id_createur} = req.body;
    try {
        const evenement = await Evenement.findByPk(id_evenement);
        if (evenement) {
            await evenement.update({
                nom,
                description,
                date_debut,
                date_fin,
                id_createur
            });
            res.json(evenement);
        } else {
            res.status(404).json({error: 'Evenement non trouvé'});
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un evenement
exports.deleteEvenement = async(req, res) => {
    const {id_evenement} = req.params;
    try {
        const evenement = await Evenement.findByPk(id_evenement);
        if (evenement) {
            await evenement.destroy();
            res.json({ message: 'Evenement supprimé' });
        } else {
            res.status(404).json({ error: 'Evenement non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};