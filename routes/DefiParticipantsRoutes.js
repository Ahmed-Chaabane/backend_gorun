const express = require('express');
const { body } = require('express-validator');
const DefiParticipantsController = require('../controllers/DefiParticipantsController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: Gestion des participants des défis communautaires
 */

/**
 * @swagger
 * /api/defiparticipants:
 *   get:
 *     summary: Obtenir la liste de tous les participants
 *     tags: [Participants]
 *     responses:
 *       200:
 *         description: Liste des participants récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', DefiParticipantsController.getAllParticipants);

/**
 * @swagger
 * /api/defiparticipants:
 *   post:
 *     summary: Ajouter un participant à un défi
 *     tags: [Participants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_defi_communautaire:
 *                 type: integer
 *                 description: ID du défi communautaire
 *               firebase_uid:
 *                 type: string
 *                 description: UID Firebase du participant
 *               progression:
 *                 type: number
 *                 description: Progression du participant (par défaut 0)
 *               statut:
 *                 type: string
 *                 description: Statut du participant
 *     responses:
 *       201:
 *         description: Participant ajouté avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('id_defi_communautaire').isNumeric().withMessage("L'ID du défi communautaire doit être un nombre."),
        body('firebase_uid').isString().withMessage("L'UID Firebase doit être une chaîne de caractères."),
    ],
    DefiParticipantsController.addParticipant
);

/**
 * @swagger
 * /api/defiparticipants/{id_defi_communautaire}:
 *   get:
 *     summary: Récupérer les participants d'un défi par ID du défi communautaire
 *     tags: [Participants]
 *     parameters:
 *       - name: id_defi_communautaire
 *         in: path
 *         description: ID du défi communautaire
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des participants du défi récupérée
 *       404:
 *         description: Défi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_defi_communautaire', DefiParticipantsController.getParticipantsByIdDefi);

/**
 * @swagger
 * /api/defiparticipants/{id_defi_communautaire}/{firebase_uid}:
 *   put:
 *     summary: Mettre à jour un participant
 *     tags: [Participants]
 *     parameters:
 *       - name: id_defi_communautaire
 *         in: path
 *         description: ID du défi communautaire
 *         required: true
 *         schema:
 *           type: integer
 *       - name: firebase_uid
 *         in: path
 *         description: UID de l'utilisateur Firebase
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progression:
 *                 type: number
 *               statut:
 *                 type: string
 *               firebase_uid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Participant mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Participant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_defi_communautaire/:firebase_uid',
    [
        body('progression').optional().isNumeric().withMessage("La progression doit être un nombre."),
        body('statut').optional().isString().withMessage("Le statut doit être une chaîne de caractères."),
        body('firebase_uid').optional().isString().withMessage("L'UID Firebase doit être une chaîne de caractères."),
    ],
    DefiParticipantsController.updateParticipant
);

/**
 * @swagger
 * /api/defiparticipants/{id_defi_communautaire}/{firebase_uid}:
 *   delete:
 *     summary: Supprimer un participant
 *     tags: [Participants]
 *     parameters:
 *       - name: id_defi_communautaire
 *         in: path
 *         description: ID du défi communautaire
 *         required: true
 *         schema:
 *           type: integer
 *       - name: firebase_uid
 *         in: path
 *         description: UID de l'utilisateur Firebase
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participant supprimé avec succès
 *       404:
 *         description: Participant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_defi_communautaire/:firebase_uid', DefiParticipantsController.deleteParticipant);

// Récupérer les défis d'un utilisateur par firebase_uid
router.get('/user/challenges', DefiParticipantsController.getUserChallenges);

module.exports = router;
