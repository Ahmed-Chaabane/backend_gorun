const express = require('express'); // Importation du framework express
const { body, validationResult } = require('express-validator'); // Validation de données
const RecommandationRecuperationController = require('../controllers/RecommandationRecuperationController'); // Importation du contrôleur
const router = express.Router(); // Création d'un routeur express

/**
 * @swagger
 * tags:
 *   name: Recommandations Récupération
 *   description: Gestion des recommandations de récupération
 */

/**
 * @swagger
 * /api/recommandationrecuperation:
 *   get:
 *     summary: Obtenir toutes les recommandations de récupération
 *     tags: [Recommandations Récupération]
 *     responses:
 *       200:
 *         description: Liste des recommandations de récupération récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', RecommandationRecuperationController.getRecommandationRecuperation);

/**
 * @swagger
 * /api/recommandationrecuperation:
 *   post:
 *     summary: Ajouter une recommandation de récupération
 *     tags: [Recommandations Récupération]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description de la recommandation de récupération
 *               id_recuperation_blessure:
 *                 type: integer
 *                 description: ID de la récupération blessure associée
 *     responses:
 *       201:
 *         description: Recommandation de récupération ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('description')
            .isString()
            .notEmpty()
            .withMessage('La description est obligatoire'),
        body('id_recuperation_blessure')
            .isInt()
            .notEmpty()
            .withMessage('L\'ID de la récupération blessure est obligatoire'),
    ],
    RecommandationRecuperationController.addRecommandationRecuperation
);

/**
 * @swagger
 * /api/recommandationrecuperation/{id_recommandation}:
 *   get:
 *     summary: Récupérer une recommandation de récupération par son ID
 *     tags: [Recommandations Récupération]
 *     parameters:
 *       - name: id_recommandation
 *         in: path
 *         required: true
 *         description: ID de la recommandation de récupération à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommandation de récupération récupérée avec succès
 *       404:
 *         description: Recommandation de récupération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_recommandation', RecommandationRecuperationController.getRecommandationRecuperationById);

/**
 * @swagger
 * /api/recommandationrecuperation/{id_recommandation}:
 *   put:
 *     summary: Mettre à jour une recommandation de récupération
 *     tags: [Recommandations Récupération]
 *     parameters:
 *       - name: id_recommandation
 *         in: path
 *         required: true
 *         description: ID de la recommandation de récupération à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description de la recommandation de récupération
 *               id_recuperation_blessure:
 *                 type: integer
 *                 description: ID de la récupération blessure associée
 *     responses:
 *       200:
 *         description: Recommandation de récupération mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Recommandation de récupération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_recommandation',
    [
        body('description')
            .isString()
            .notEmpty()
            .withMessage('La description est obligatoire'),
        body('id_recuperation_blessure')
            .isInt()
            .notEmpty()
            .withMessage('L\'ID de la récupération blessure est obligatoire'),
    ],
    RecommandationRecuperationController.updateRecommandationRecuperation
);

/**
 * @swagger
 * /api/recommandationrecuperation/{id_recommandation}:
 *   delete:
 *     summary: Supprimer une recommandation de récupération
 *     tags: [Recommandations Récupération]
 *     parameters:
 *       - name: id_recommandation
 *         in: path
 *         required: true
 *         description: ID de la recommandation de récupération à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommandation de récupération supprimée avec succès
 *       404:
 *         description: Recommandation de récupération non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_recommandation', RecommandationRecuperationController.deleteRecommandationRecuperation);

module.exports = router;