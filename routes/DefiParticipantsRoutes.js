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
 *               id_defi:
 *                 type: integer
 *                 description: ID du défi
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur
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
        body('id_defi')
            .isNumeric()
            .withMessage('L\'ID du défi doit être un nombre.'),
        body('id_utilisateur')
            .isNumeric()
            .withMessage('L\'ID de l\'utilisateur doit être un nombre.')
    ],
    DefiParticipantsController.addParticipant
);

/**
 * @swagger
 * /api/defiparticipants/{id_defi}:
 *   get:
 *     summary: Récupérer les participants d'un défi par ID du défi
 *     tags: [Participants]
 *     parameters:
 *       - name: id_defi
 *         in: path
 *         description: ID du défi
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
router.get('/:id_defi', DefiParticipantsController.getParticipantsByIdDefi);

/**
 * @swagger
 * /api/defiparticipants/{id_participant}:
 *   put:
 *     summary: Mettre à jour un participant par ID
 *     tags: [Participants]
 *     parameters:
 *       - name: id_participant
 *         in: path
 *         description: ID du participant
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_defi:
 *                 type: integer
 *               id_utilisateur:
 *                 type: integer
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
    '/:id_participant',
    [
        body('id_defi')
            .isNumeric()
            .withMessage('L\'ID du défi doit être un nombre.'),
        body('id_utilisateur')
            .isNumeric()
            .withMessage('L\'ID de l\'utilisateur doit être un nombre.')
    ],
    DefiParticipantsController.updateParticipant
);

/**
 * @swagger
 * /api/defiparticipants/{id_participant}:
 *   delete:
 *     summary: Supprimer un participant par ID
 *     tags: [Participants]
 *     parameters:
 *       - name: id_participant
 *         in: path
 *         description: ID du participant
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant supprimé avec succès
 *       404:
 *         description: Participant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_participant', DefiParticipantsController.deleteParticipant);

module.exports = router;
