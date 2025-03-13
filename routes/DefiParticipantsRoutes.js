const express = require('express');
const { body } = require('express-validator');
const DefiParticipantsController = require('../controllers/DefiParticipantsController');
const Utilisateur = require('../models/Utilisateur'); // Importer le modèle Utilisateur

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: Gestion des participants des défis communautaires
 */

// Obtenir la liste de tous les participants
router.get('/', DefiParticipantsController.getAllParticipants);

// Ajouter un participant à un défi
router.post(
    '/',
    [
        body('id_defi_communautaire').isNumeric().withMessage("L'ID du défi communautaire doit être un nombre."),
        body('firebase_uid').isString().withMessage("L'UID Firebase doit être une chaîne de caractères."),
    ],
    async (req, res, next) => {
        const { firebase_uid } = req.body;
        try {
            const utilisateur = await Utilisateur.findOne({ where: { firebase_uid } });
            if (!utilisateur) return res.status(404).json({ error: 'Utilisateur non trouvé' });
            req.body.id_utilisateur = utilisateur.id;
            next();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur serveur', details: error.message });
        }
    },
    DefiParticipantsController.addParticipant
);

// Récupérer les participants d'un défi par ID du défi communautaire
router.get('/:id_defi_communautaire', DefiParticipantsController.getParticipantsByIdDefi);

// Mettre à jour un participant
router.put(
    '/:id_defi_communautaire/:firebase_uid',
    [
        body('progression').optional().isNumeric().withMessage("La progression doit être un nombre."),
        body('statut').optional().isString().withMessage("Le statut doit être une chaîne de caractères."),
    ],
    async (req, res, next) => {
        const { firebase_uid } = req.params;
        try {
            const utilisateur = await Utilisateur.findOne({ where: { firebase_uid } });
            if (!utilisateur) return res.status(404).json({ error: 'Utilisateur non trouvé' });
            req.body.id_utilisateur = utilisateur.id;
            next();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            res.status(500).json({ error: 'Erreur serveur', details: error.message });
        }
    },
    DefiParticipantsController.updateParticipant
);

// Supprimer un participant
router.delete('/:id_defi_communautaire/:firebase_uid', DefiParticipantsController.deleteParticipant);

// Récupérer les défis d'un utilisateur par firebase_uid
router.get('/user/challenges', DefiParticipantsController.getUserChallenges);

module.exports = router;
