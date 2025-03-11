const { body, validationResult } = require('express-validator');
const DefiParticipants = require('../models/DefiParticipants'); // Importez les modèles
const DefiCommunautaire = require('../models/DefiCommunautaire'); // Importez les modèles
const Utilisateur = require('../models/Utilisateur'); // Importez les modèles
const { Op, Sequelize } = require('sequelize');

// Obtenir la liste des participants
exports.getAllParticipants = async (req, res) => {
    try {
        const participants = await DefiParticipants.findAll();
        if (participants.length > 0) {
            res.status(200).json(participants);
        } else {
            res.status(404).json({ error: 'Aucun participant trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

// Ajouter un participant
exports.addParticipant = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id_defi_communautaire, firebase_uid, progression = 0, statut } = req.body;

    try {
        const newParticipant = await DefiParticipants.create({
            id_defi_communautaire,  // Utilisation de id_defi_communautaire pour l'association
            firebase_uid,
            progression,
            statut
        });
        res.status(201).json(newParticipant);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement du participant', details: err.message });
    }
};

// Récupérer les participants d’un défi spécifique
exports.getParticipantsByIdDefi = async (req, res) => {
    const { id_defi_communautaire } = req.params;  // On récupère id_defi_communautaire maintenant

    try {
        const participants = await DefiParticipants.findAll({
            where: { id_defi_communautaire }
        });

        if (participants.length > 0) {
            res.status(200).json(participants);
        } else {
            res.status(404).json({ error: 'Pas de participants dans ce défi' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des participants du défi:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// Récupérer les défis d'un utilisateur par firebase_uid
exports.getUserChallenges = async (req, res) => {
    const { firebase_uid } = req.query;

    try {
        // Chercher l'utilisateur par firebase_uid
        const utilisateur = await Utilisateur.findOne({
            where: { firebase_uid },
            include: [{
                model: DefiParticipants,
                as: 'defiParticipants',
                include: [{
                    model: DefiCommunautaire,
                    as: 'defi', // Relier à l'association 'defi'
                    required: true, // Ne récupérer que les participants ayant un défi communautaire associé
                }],
            }]
        });

        // Vérifier si l'utilisateur existe
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Extraire les défis de l'utilisateur à partir des participants
        const challenges = utilisateur.defiParticipants.map(participant => participant.defi);

        // Retourner les défis à l'utilisateur
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Erreur lors de la récupération des défis utilisateur :', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};


// Mettre à jour un participant
exports.updateParticipant = async (req, res) => {
    const { id_defi_communautaire, firebase_uid } = req.params;  // Modification de la récupération par id_defi_communautaire
    const { progression, statut } = req.body;

    try {
        const participant = await DefiParticipants.findOne({
            where: { id_defi_communautaire, firebase_uid }
        });

        if (participant) {
            await participant.update({
                progression,
                statut,
                firebase_uid
            });
            res.status(200).json(participant);
        } else {
            res.status(404).json({ error: 'Participant non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la mise à jour du participant:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// Supprimer un participant
exports.deleteParticipant = async (req, res) => {
    const { id_defi_communautaire, firebase_uid } = req.params;  // Modification pour id_defi_communautaire et firebase_uid

    try {
        const participant = await DefiParticipants.findOne({
            where: { id_defi_communautaire, firebase_uid }
        });

        if (participant) {
            await participant.destroy();
            res.status(200).json({ message: 'Participant supprimé avec succès' });
        } else {
            res.status(404).json({ error: 'Participant non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du participant:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};
