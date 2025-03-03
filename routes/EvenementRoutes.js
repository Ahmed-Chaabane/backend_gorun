const express = require('express');
const { body } = require('express-validator');
const EvenementController = require('../controllers/EvenementController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Événements
 *   description: Gestion des événements
 */

/**
 * @swagger
 * /api/evenement:
 *   get:
 *     summary: Obtenir tous les événements
 *     tags: [Événements]
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', EvenementController.getAllEvenements);

/**
 * @swagger
 * /api/evenement:
 *   post:
 *     summary: Ajouter un événement
 *     tags: [Événements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de l'événement
 *               description:
 *                 type: string
 *                 description: Description de l'événement
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'événement au format YYYY-MM-DD
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'événement au format YYYY-MM-DD
 *               id_createur:
 *                 type: integer
 *                 description: ID du créateur de l'événement
 *     responses:
 *       201:
 *         description: Événement ajouté avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('nom').notEmpty().withMessage('Le nom est requis'),
        body('description').isString().withMessage('La description est requise'),
        body('date_debut')
            .notEmpty()
            .isDate({ format: 'YYYY-MM-DD', strictMode: true })
            .withMessage('La date de début doit être une date au format YYYY-MM-DD'),
        body('date_fin')
            .notEmpty()
            .isDate({ format: 'YYYY-MM-DD', strictMode: true })
            .withMessage('La date de fin doit être une date au format YYYY-MM-DD'),
        body('id_createur').isInt().withMessage('id_createur doit être un entier'),
    ],
    EvenementController.addEvenement
);

/**
 * @swagger
 * /api/evenement/{id_evenement}:
 *   get:
 *     summary: Obtenir un événement par ID
 *     tags: [Événements]
 *     parameters:
 *       - name: id_evenement
 *         in: path
 *         required: true
 *         description: ID de l'événement à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Événement récupéré avec succès
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_evenement', EvenementController.getEvenementById);

/**
 * @swagger
 * /api/evenement/{id_evenement}:
 *   put:
 *     summary: Mettre à jour un événement
 *     tags: [Événements]
 *     parameters:
 *       - name: id_evenement
 *         in: path
 *         required: true
 *         description: ID de l'événement à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de l'événement
 *               description:
 *                 type: string
 *                 description: Description de l'événement
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'événement au format YYYY-MM-DD
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'événement au format YYYY-MM-DD
 *               id_createur:
 *                 type: integer
 *                 description: ID du créateur de l'événement
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_evenement',
    [
        body('nom').notEmpty().withMessage('Le nom est requis'),
        body('description').isString().withMessage('La description est requise'),
        body('date_debut')
            .notEmpty()
            .isDate({ format: 'YYYY-MM-DD', strictMode: true })
            .withMessage('La date de début doit être une date au format YYYY-MM-DD'),
        body('date_fin')
            .notEmpty()
            .isDate({ format: 'YYYY-MM-DD', strictMode: true })
            .withMessage('La date de fin doit être une date au format YYYY-MM-DD'),
        body('id_createur').isInt().withMessage('id_createur doit être un entier'),
    ],
    EvenementController.updateEvenement
);

/**
 * @swagger
 * /api/evenement/{id_evenement}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags: [Événements]
 *     parameters:
 *       - name: id_evenement
 *         in: path
 *         required: true
 *         description: ID de l'événement à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Événement supprimé avec succès
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_evenement', EvenementController.deleteEvenement);

module.exports = router;