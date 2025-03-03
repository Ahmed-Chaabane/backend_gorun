const express = require('express');
const { body, validationResult } = require('express-validator'); // Validation de données
const DefiCommunautaireController = require('../controllers/DefiCommunautaireController'); // Importer le contrôleur DefiCommunautaire
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DefiCommunautaire
 *   description: API pour gérer les défis communautaires
 */

/**
 * @swagger
 * /api/deficommunautaire:
 *   get:
 *     summary: Récupérer tous les défis communautaires
 *     tags: [DefiCommunautaire]
 *     responses:
 *       200:
 *         description: Liste des défis communautaires
 *       400:
 *         description: Erreur serveur
 */
router.get('/', DefiCommunautaireController.getAllDefiCommunautaire);

/**
 * @swagger
 * /api/deficommunautaire:
 *   post:
 *     summary: Ajouter un nouveau défi communautaire
 *     tags: [DefiCommunautaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_defi:
 *                 type: string
 *               description:
 *                 type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               objectif:
 *                 type: string
 *     responses:
 *       201:
 *         description: Défi ajouté avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', [
    body('nom_defi')
        .isString()
        .notEmpty()
        .withMessage('Le nom du défi est obligatoire'),
    body('description')
        .isString()
        .notEmpty()
        .withMessage('La description est obligatoire'),
    body('date_debut')
        .isISO8601()
        .notEmpty()
        .withMessage('La date de début est obligatoire et doit être valide'),
    body('date_fin')
        .isISO8601()
        .notEmpty()
        .withMessage('La date de fin est obligatoire et doit être valide'),
    body('objectif')
        .isString()
        .notEmpty()
        .withMessage('L\'objectif est obligatoire'),
], DefiCommunautaireController.addDefiCommunautaire);

/**
 * @swagger
 * /api/deficommunautaire/{id_defi_communautaire}:
 *   get:
 *     summary: Récupérer un défi communautaire par son ID
 *     tags: [DefiCommunautaire]
 *     parameters:
 *       - name: id_defi_communautaire
 *         in: path
 *         description: ID du défi communautaire
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Défi communautaire trouvé
 *       404:
 *         description: Défi communautaire non trouvé
 */
router.get('/:id_defi_communautaire', DefiCommunautaireController.getDefiCommunautaireById);

/**
 * @swagger
 * /api/deficommunautaire/{id_defi_communautaire}:
 *   put:
 *     summary: Mettre à jour un défi communautaire
 *     tags: [DefiCommunautaire]
 *     parameters:
 *       - name: id_defi_communautaire
 *         in: path
 *         description: ID du défi communautaire à mettre à jour
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
 *               nom_defi:
 *                 type: string
 *               description:
 *                 type: string
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               objectif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Défi communautaire mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Défi communautaire non trouvé
 */
router.put('/:id_defi_communautaire', [
    body('nom_defi')
        .isString()
        .notEmpty()
        .withMessage('Le nom du défi est obligatoire'),
    body('description')
        .isString()
        .notEmpty()
        .withMessage('La description est obligatoire'),
    body('date_debut')
        .isISO8601()
        .notEmpty()
        .withMessage('La date de début est obligatoire et doit être valide'),
    body('date_fin')
        .isISO8601()
        .notEmpty()
        .withMessage('La date de fin est obligatoire et doit être valide'),
    body('objectif')
        .isString()
        .notEmpty()
        .withMessage('L\'objectif est obligatoire'),
], DefiCommunautaireController.updateDefiCommunautaire);

/**
 * @swagger
 * /api/deficommunautaire/{id_defi_communautaire}:
 *   delete:
 *     summary: Supprimer un défi communautaire
 *     tags: [DefiCommunautaire]
 *     parameters:
 *       - name: id_defi_communautaire
 *         in: path
 *         description: ID du défi communautaire à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Défi communautaire supprimé avec succès
 *       404:
 *         description: Défi communautaire non trouvé
 */
router.delete('/:id_defi_communautaire', DefiCommunautaireController.deleteDefiCommunautaire);

module.exports = router;