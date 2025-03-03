const express = require('express');
const { body } = require('express-validator');
const DetailActiviteSportiveController = require('../controllers/DetailActiviteSportiveController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Détails Activités Sportives
 *   description: Gestion des détails liés aux activités sportives
 */

/**
 * @swagger
 * /api/detailactivitesportive:
 *   get:
 *     summary: Obtenir tous les détails des activités sportives
 *     tags: [Détails Activités Sportives]
 *     responses:
 *       200:
 *         description: Liste des détails récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', DetailActiviteSportiveController.getAllDetailActiviteSportiveController);

/**
 * @swagger
 * /api/detailactivitesportive:
 *   post:
 *     summary: Ajouter un détail d'activité sportive
 *     tags: [Détails Activités Sportives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_activite_sportive:
 *                 type: integer
 *                 description: ID de l'activité sportive
 *               moment:
 *                 type: string
 *                 description: Moment de l'activité
 *               intensite:
 *                 type: string
 *                 description: Intensité de l'activité
 *               location:
 *                 type: string
 *                 description: Emplacement de l'activité
 *     responses:
 *       201:
 *         description: Détail ajouté avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('id_activite_sportive')
            .notEmpty()
            .withMessage("L'id de l'activité sportive est requis"),
        body('moment')
            .notEmpty()
            .withMessage('Le moment est requis'),
        body('intensite')
            .notEmpty()
            .withMessage("L'intensité est requise"),
        body('location')
            .notEmpty()
            .withMessage('La location est requise'),
    ],
    DetailActiviteSportiveController.addDetailActiviteSportiveController
);

/**
 * @swagger
 * /api/detailactivitesportive/{id_detail_activite}:
 *   get:
 *     summary: Obtenir un détail d'activité sportive par ID
 *     tags: [Détails Activités Sportives]
 *     parameters:
 *       - name: id_detail_activite
 *         in: path
 *         required: true
 *         description: ID du détail d'activité sportive
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail récupéré avec succès
 *       404:
 *         description: Détail non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_detail_activite', DetailActiviteSportiveController.getDetailActiviteSportiveByIdController);

/**
 * @swagger
 * /api/detailactivitesportive/{id_detail_activite}:
 *   put:
 *     summary: Mettre à jour un détail d'activité sportive
 *     tags: [Détails Activités Sportives]
 *     parameters:
 *       - name: id_detail_activite
 *         in: path
 *         required: true
 *         description: ID du détail d'activité sportive à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_activite_sportive:
 *                 type: integer
 *                 description: ID de l'activité sportive
 *               moment:
 *                 type: string
 *                 description: Moment de l'activité
 *               intensite:
 *                 type: string
 *                 description: Intensité de l'activité
 *               location:
 *                 type: string
 *                 description: Emplacement de l'activité
 *     responses:
 *       200:
 *         description: Détail mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Détail non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_detail_activite',
    [
        body('id_activite_sportive').optional(),
        body('moment').optional(),
        body('intensite').optional(),
        body('location').optional(),
    ],
    DetailActiviteSportiveController.updateDetailActiviteSportiveController
);

/**
 * @swagger
 * /api/detailactivitesportive/{id_detail_activite}:
 *   delete:
 *     summary: Supprimer un détail d'activité sportive
 *     tags: [Détails Activités Sportives]
 *     parameters:
 *       - name: id_detail_activite
 *         in: path
 *         required: true
 *         description: ID du détail d'activité sportive à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail supprimé avec succès
 *       404:
 *         description: Détail non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_detail_activite', DetailActiviteSportiveController.deleteDetailActiviteSportiveController);

module.exports = router;