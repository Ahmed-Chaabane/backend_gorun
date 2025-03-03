const {body,validationResult} = require('express-validator');
const DefiParticipants = require('../models/DefiParticipants');

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
        res.status(400).json({
            error: 'Erreur serveur',
            details: error.message,
        });
    }
};

// Ajouter un participant
exports. addParticipant = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id_defi, id_utilisateur } = req.body;
    try {
        const newParticipant = await DefiParticipants.create({
            id_defi,
            id_utilisateur
        });
        res.status(201).json(newParticipant);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement du participant', details: err.message });
    }
};

// Récupérer les participants par ID defi
exports.getParticipantsByIdDefi = async(req, res) => {
    const {id_defi} = req.params;
    try {
        const participants = await DefiParticipants.find({
            id_defi
        });
        if (participants.length > 0) {
            res.json(participants);
        } else {
            res.status(404).json({error: 'pas de participants dans ce defi'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Mis à jour d'un participant par ID
exports.updateParticipant = async(req, res) => {
    const {id_participant} = req.params;
    const {id_defi, id_utilisateur} = req.body;
    try {
        const participant = await DefiParticipants.findByPk(id_participant);
        if (participant) {
            await participant.update({
                id_defi,
                id_utilisateur
            });
            res.json(participant);
        } else {
            res.status(404).json({error: 'Participant non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Supprimer un participant par ID
exports.deleteParticipant = async(req, res) =>{
    const {id_participant} = req.params;
    try {
        const participant = await DefiParticipants.findByPk(id_participant);
        if (participant) {
            await participant.destroy();
            res.json({message: 'Participant supprimé'});
        } else {
            res.status(404).json({error: 'Participant non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
}