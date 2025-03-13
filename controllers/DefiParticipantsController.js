const { body, validationResult } = require('express-validator');
const DefiParticipants = require('../models/DefiParticipants');
const DefiCommunautaire = require('../models/DefiCommunautaire');
const Utilisateur = require('../models/Utilisateur');
const { Op } = require('sequelize');

// 🔹 Obtenir la liste des participants
exports.getAllParticipants = async (req, res) => {
    try {
        const participants = await DefiParticipants.findAll();
        return res.status(200).json(participants.length > 0 ? participants : { error: 'Aucun participant trouvé' });
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

// 🔹 Ajouter un participant à un défi
exports.addParticipant = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id_defi_communautaire, firebase_uid, progression = 0, statut = 'en cours' } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const utilisateur = await Utilisateur.findOne({ where: { firebase_uid } });
        if (!utilisateur) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        // Vérifier si le participant existe déjà dans ce défi
        const existingParticipant = await DefiParticipants.findOne({
            where: { firebase_uid, id_defi_communautaire }
        });
        if (existingParticipant) return res.status(400).json({ error: 'Utilisateur déjà inscrit à ce défi' });

        // Créer le participant
        const newParticipant = await DefiParticipants.create({
            id_utilisateur: utilisateur.id_utilisateur, // Correction
            id_defi_communautaire,
            firebase_uid,
            progression,
            statut
        });

        res.status(201).json(newParticipant);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(500).json({ error: 'Erreur lors de l’enregistrement du participant', details: err.message });
    }
};

// 🔹 Récupérer les participants d’un défi
exports.getParticipantsByIdDefi = async (req, res) => {
    try {
        const participants = await DefiParticipants.findAll({
            where: { id_defi_communautaire: req.params.id_defi_communautaire }
        });

        return res.status(200).json(participants.length > 0 ? participants : { error: 'Pas de participants dans ce défi' });
    } catch (err) {
        console.error('Erreur récupération participants défi:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// 🔹 Récupérer les défis d'un utilisateur par firebase_uid
exports.getUserChallenges = async (req, res) => {
    const { firebase_uid } = req.query;

    try {
        const utilisateur = await Utilisateur.findOne({
            where: { firebase_uid },
            include: [{
                model: DefiParticipants,
                as: 'defiParticipants',
                include: [{
                    model: DefiCommunautaire,
                    as: 'defi', // Assurez-vous que cette alias est bien défini dans les associations
                    required: true,
                }],
            }]
        });

        if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const challenges = utilisateur.defiParticipants?.map(participant => participant.defi) || [];
        res.status(200).json(challenges);
    } catch (error) {
        console.error('Erreur récupération défis utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

// 🔹 Mettre à jour un participant
exports.updateParticipant = async (req, res) => {
    const { id_defi_communautaire, firebase_uid } = req.params;
    const { progression, statut } = req.body;

    try {
        const participant = await DefiParticipants.findOne({
            where: { id_defi_communautaire, firebase_uid }
        });

        if (!participant) return res.status(404).json({ error: 'Participant non trouvé' });

        await participant.update({ progression, statut });
        res.status(200).json(participant);
    } catch (err) {
        console.error('Erreur mise à jour participant:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// 🔹 Supprimer un participant
exports.deleteParticipant = async (req, res) => {
    const { id_defi_communautaire, firebase_uid } = req.params;

    try {
        const participant = await DefiParticipants.findOne({
            where: { id_defi_communautaire, firebase_uid }
        });

        if (!participant) return res.status(404).json({ error: 'Participant non trouvé' });

        await participant.destroy();
        res.status(200).json({ message: 'Participant supprimé avec succès' });
    } catch (err) {
        console.error('Erreur suppression participant:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};
