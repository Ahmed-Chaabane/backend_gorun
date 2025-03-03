const express = require('express'); // Importation du framework express
const { body, validationResult } = require('express-validator'); // Validation de données
const RecommandationEntrainementController = require('../controllers/RecommandationEntrainementController'); // Importation du contrôleur
const router = express.Router(); // Création d'un routeur express

/**
 * @swagger
 * tags:
 *   name: Recommandations Entraînements
 *   description: Gestion des recommandations d'entraînement
 */

/**
 * @swagger
 * /api/recommandationentrainement:
 *   get:
 *     summary: Obtenir toutes les recommandations d'entraînement
 *     tags: [Recommandations Entraînements]
 *     responses:
 *       200:
 *         description: Liste des recommandations d'entraînement récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', RecommandationEntrainementController.getAllRecommandationEntrainement);

/**
 * @swagger
 * /api/recommandationentrainement:
 *   post:
 *     summary: Ajouter une recommandation d'entraînement
 *     tags: [Recommandations Entraînements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description de la recommandation d'entraînement
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur auquel la recommandation est associée
 *     responses:
 *       201:
 *         description: Recommandation d'entraînement ajoutée avec succès
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
        body('id_utilisateur')
            .isInt()
            .notEmpty()
            .withMessage('L\'ID de l\'utilisateur est obligatoire'),
    ],
    RecommandationEntrainementController.addRecommandationEntrainement
);

/**
 * @swagger
 * /api/recommandationentrainement/{id_recommandationEntrainement}:
 *   get:
 *     summary: Récupérer une recommandation d'entraînement par son ID
 *     tags: [Recommandations Entraînements]
 *     parameters:
 *       - name: id_recommandationEntrainement
 *         in: path
 *         required: true
 *         description: ID de la recommandation d'entraînement à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommandation d'entraînement récupérée avec succès
 *       404:
 *         description: Recommandation d'entraînement non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_recommandationEntrainement', RecommandationEntrainementController.getRecommandationEntrainementById);

/**
 * @swagger
 * /api/recommandationentrainement/{id_recommandationEntrainement}:
 *   put:
 *     summary: Mettre à jour une recommandation d'entraînement
 *     tags: [Recommandations Entraînements]
 *     parameters:
 *       - name: id_recommandationEntrainement
 *         in: path
 *         required: true
 *         description: ID de la recommandation d'entraînement à mettre à jour
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
 *                 description: Description de la recommandation d'entraînement
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur auquel la recommandation est associée
 *     responses:
 *       200:
 *         description: Recommandation d'entraînement mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Recommandation d'entraînement non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_recommandationEntrainement',
    [
        body('description')
            .isString()
            .notEmpty()
            .withMessage('La description est obligatoire'),
        body('id_utilisateur')
            .isInt()
            .notEmpty()
            .withMessage('L\'ID de l\'utilisateur est obligatoire'),
    ],
    RecommandationEntrainementController.updateRecommandationEntrainement
);

/**
 * @swagger
 * /api/recommandationentrainement/{id_recommandationEntrainement}:
 *   delete:
 *     summary: Supprimer une recommandation d'entraînement
 *     tags: [Recommandations Entraînements]
 *     parameters:
 *       - name: id_recommandationEntrainement
 *         in: path
 *         required: true
 *         description: ID de la recommandation d'entraînement à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommandation d'entraînement supprimée avec succès
 *       404:
 *         description: Recommandation d'entraînement non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_recommandationEntrainement', RecommandationEntrainementController.deleteRecommandationEntrainement);

/**
 * @swagger
 * /api/recommandationentrainement/generate:
 *   post:
 *     summary: Générer une recommandation d'entraînement via Firebase ML et l'enregistrer
 *     tags: [Recommandations Entraînements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               poids:
 *                 type: number
 *                 description: Poids de l'utilisateur
 *               taille:
 *                 type: number
 *                 description: Taille de l'utilisateur
 *               age:
 *                 type: integer
 *                 description: Âge de l'utilisateur
 *               objectif:
 *                 type: string
 *                 description: Objectif sportif de l'utilisateur
 *     responses:
 *       201:
 *         description: Recommandation générée et enregistrée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/generate', RecommandationEntrainementController.generateAndSaveRecommandation);

module.exports = router;