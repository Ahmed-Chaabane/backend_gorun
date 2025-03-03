const express = require('express');
const { body, validationResult } = require('express-validator');
const ProgressionObjectifController = require('../controllers/ProgressionObjectifController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Progressions Objectifs
 *   description: Gestion des progressions des objectifs sportifs
 */

/**
 * @swagger
 * /api/progressionobjectif:
 *   get:
 *     summary: Obtenir toutes les progressions d'objectifs
 *     tags: [Progressions Objectifs]
 *     responses:
 *       200:
 *         description: Liste des progressions des objectifs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', ProgressionObjectifController.getAllProgressionObjectif);

/**
 * @swagger
 * /api/progressionobjectif:
 *   post:
 *     summary: Ajouter une progression d'objectif
 *     tags: [Progressions Objectifs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_objectif_sportif:
 *                 type: integer
 *                 description: ID de l'objectif sportif lié à la progression
 *               id_activite_sportive:
 *                 type: integer
 *                 description: ID de l'activité sportive associée à la progression
 *               progression:
 *                 type: number
 *                 format: float
 *                 description: Progression de l'objectif (entre 0 et 100)
 *     responses:
 *       201:
 *         description: Progression d'objectif ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('id_objectif_sportif')
            .isInt()
            .withMessage('L\'ID de l\'objectif sportif est requis'),
        body('id_activite_sportive')
            .isInt()
            .withMessage('L\'ID de l\'activité sportive est requis'),
        body('progression')
            .isFloat({ min: 0, max: 100 })
            .withMessage('La progression doit être un nombre entre 0 et 100'),
    ],
    ProgressionObjectifController.addProgressionObjectif
);

/**
 * @swagger
 * /api/progressionobjectif/{id_progression}:
 *   get:
 *     summary: Récupérer une progression d'objectif par son ID
 *     tags: [Progressions Objectifs]
 *     parameters:
 *       - name: id_progression
 *         in: path
 *         required: true
 *         description: ID de la progression d'objectif à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progression d'objectif récupérée avec succès
 *       404:
 *         description: Progression d'objectif non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_progression', ProgressionObjectifController.getProgressionObjectifById);

/**
 * @swagger
 * /api/progressionobjectif/{id_progression}:
 *   put:
 *     summary: Mettre à jour une progression d'objectif
 *     tags: [Progressions Objectifs]
 *     parameters:
 *       - name: id_progression
 *         in: path
 *         required: true
 *         description: ID de la progression d'objectif à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_objectif_sportif:
 *                 type: integer
 *                 description: ID de l'objectif sportif lié à la progression
 *               id_activite_sportive:
 *                 type: integer
 *                 description: ID de l'activité sportive associée à la progression
 *               progression:
 *                 type: number
 *                 format: float
 *                 description: Progression de l'objectif (entre 0 et 100)
 *     responses:
 *       200:
 *         description: Progression d'objectif mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Progression d'objectif non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_progression',
    [
        body('id_objectif_sportif')
            .isInt()
            .withMessage('L\'ID de l\'objectif sportif est requis'),
        body('id_activite_sportive')
            .isInt()
            .withMessage('L\'ID de l\'activité sportive est requis'),
        body('progression')
            .isFloat({ min: 0, max: 100 })
            .withMessage('La progression doit être un nombre entre 0 et 100'),
    ],
    ProgressionObjectifController.updateProgressionObjectif
);

/**
 * @swagger
 * /api/progressionobjectif/{id_progression}:
 *   delete:
 *     summary: Supprimer une progression d'objectif
 *     tags: [Progressions Objectifs]
 *     parameters:
 *       - name: id_progression
 *         in: path
 *         required: true
 *         description: ID de la progression d'objectif à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progression d'objectif supprimée avec succès
 *       404:
 *         description: Progression d'objectif non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_progression', ProgressionObjectifController.deleteProgressionObjectif);

module.exports = router;