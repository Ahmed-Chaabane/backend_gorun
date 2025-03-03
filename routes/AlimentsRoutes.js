const express = require('express');
const { body, validationResult } = require('express-validator'); // Validation de données
const AlimentsController = require('../controllers/AlimentsController'); // Importer le contrôleur Aliments
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Aliment
 *   description: API pour gérer les aliments
 */

/**
 * @swagger
 * /api/aliments:
 *   get:
 *     summary: Récupérer tous les aliments
 *     tags: [Aliment]
 *     responses:
 *       200:
 *         description: Liste des aliments
 *       400:
 *         description: Erreur serveur
 */
router.get('/', AlimentsController.getAllAliments);

/**
 * @swagger
 * /api/aliments:
 *   post:
 *     summary: Ajouter un nouvel aliment
 *     tags: [Aliment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               calories:
 *                 type: number
 *                 format: float
 *               proteines:
 *                 type: number
 *                 format: float
 *               glucides:
 *                 type: number
 *                 format: float
 *               lipides:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Aliment ajouté avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', [
    body('nom')
        .isString()
        .notEmpty()
        .withMessage('Le nom est obligatoire'),
    body('calories')
        .isDecimal()
        .notEmpty()
        .withMessage('Les calories sont obligatoires'),
    body('proteines')
        .isDecimal()
        .notEmpty()
        .withMessage('Les protéines sont obligatoires'),
    body('glucides')
        .isDecimal()
        .notEmpty()
        .withMessage('Les glucides sont obligatoires'),
    body('lipides')
        .isDecimal()
        .notEmpty()
        .withMessage('Les lipides sont obligatoires'),
], AlimentsController.addAliment);

/**
 * @swagger
 * /api/aliments/{id_aliment}:
 *   get:
 *     summary: Récupérer un aliment par son ID
 *     tags: [Aliment]
 *     parameters:
 *       - name: id_aliment
 *         in: path
 *         description: ID de l'aliment
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aliment trouvé
 *       404:
 *         description: Aliment non trouvé
 */
router.get('/:id_aliment', AlimentsController.getAlimentById);

/**
 * @swagger
 * /api/aliments/{id_aliment}:
 *   put:
 *     summary: Mettre à jour un aliment
 *     tags: [Aliment]
 *     parameters:
 *       - name: id_aliment
 *         in: path
 *         description: ID de l'aliment à mettre à jour
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
 *               nom:
 *                 type: string
 *               calories:
 *                 type: number
 *                 format: float
 *               proteines:
 *                 type: number
 *                 format: float
 *               glucides:
 *                 type: number
 *                 format: float
 *               lipides:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Aliment mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Aliment non trouvé
 */
router.put('/:id_aliment', [
    body('nom')
        .isString()
        .notEmpty()
        .withMessage('Le nom est obligatoire'),
    body('calories')
        .isDecimal()
        .notEmpty()
        .withMessage('Les calories sont obligatoires'),
    body('proteines')
        .isDecimal()
        .notEmpty()
        .withMessage('Les protéines sont obligatoires'),
    body('glucides')
        .isDecimal()
        .notEmpty()
        .withMessage('Les glucides sont obligatoires'),
    body('lipides')
        .isDecimal()
        .notEmpty()
        .withMessage('Les lipides sont obligatoires'),
], AlimentsController.updateAliment);

/**
 * @swagger
 * /api/aliments/{id_aliment}:
 *   delete:
 *     summary: Supprimer un aliment
 *     tags: [Aliment]
 *     parameters:
 *       - name: id_aliment
 *         in: path
 *         description: ID de l'aliment à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aliment supprimé avec succès
 *       404:
 *         description: Aliment non trouvé
 */
router.delete('/:id_aliment', AlimentsController.deleteAliment);

module.exports = router;
