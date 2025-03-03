const express = require('express');
const { body, validationResult } = require('express-validator'); // Validation de données
const ActiviteSportiveController = require('../controllers/ActiviteSportiveController'); // Importer le contrôleur ActiviteSportive
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ActiviteSportive
 *   description: API pour gérer les activités sportives
 */

/**
 * @swagger
 * /api/activitesportive:
 *   get:
 *     summary: Récupérer toutes les activités sportives
 *     tags: [ActiviteSportive]
 *     responses:
 *       200:
 *         description: Liste des activités sportives
 *       400:
 *         description: Erreur serveur
 */
router.get('/', ActiviteSportiveController.getAllActivitesSportives);

/**
 * @swagger
 * /api/activitesportive:
 *   post:
 *     summary: Ajouter une nouvelle activité sportive
 *     tags: [ActiviteSportive]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_activite:
 *                 type: string
 *               date_activite:
 *                 type: string
 *                 format: date
 *               duree:
 *                 type: number
 *               distance:
 *                 type: number
 *               calories_brulees:
 *                 type: number
 *               id_utilisateur:
 *                 type: number
 *               id_objectif_sportif:
 *                 type: number
 *     responses:
 *       201:
 *         description: Activité sportive ajoutée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', [
    body('type_activite')
        .isString()
        .notEmpty()
        .withMessage('Le type d\'activité est obligatoire'),
    body('date_activite')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage('La date de l\'activité doit être une date valide'),
    body('duree')
        .isNumeric()
        .withMessage('La durée de l\'activité doit être un nombre'),
    body('distance')
        .isNumeric()
        .withMessage('La distance parcourue doit être un nombre'),
    body('calories_brulees')
        .isNumeric()
        .withMessage('Le nombre de calories brûlées doit être un nombre'),
    body('id_utilisateur')
        .isNumeric()
        .withMessage('L\'ID de l\'utilisateur doit être un nombre'),
    body('id_objectif_sportif')
        .isNumeric()
        .withMessage('L\'ID de l\'objectif sportif doit être un nombre'),
], ActiviteSportiveController.addActiviteSportive);

/**
 * @swagger
 * /api/activitesportive/{id_activite_sportive}:
 *   get:
 *     summary: Récupérer une activité sportive par son ID
 *     tags: [ActiviteSportive]
 *     parameters:
 *       - name: id_activite_sportive
 *         in: path
 *         description: ID de l'activité sportive
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activité sportive trouvée
 *       404:
 *         description: Activité sportive non trouvée
 */
router.get('/:id_activite_sportive', ActiviteSportiveController.getActiviteSportiveById);

/**
 * @swagger
 * /api/activitesportive/{id_activite_sportive}:
 *   put:
 *     summary: Mettre à jour une activité sportive
 *     tags: [ActiviteSportive]
 *     parameters:
 *       - name: id_activite_sportive
 *         in: path
 *         description: ID de l'activité sportive à mettre à jour
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
 *               type_activite:
 *                 type: string
 *               date_activite:
 *                 type: string
 *                 format: date
 *               duree:
 *                 type: number
 *               distance:
 *                 type: number
 *               calories_brulees:
 *                 type: number
 *               id_utilisateur:
 *                 type: number
 *               id_objectif_sportif:
 *                 type: number
 *     responses:
 *       200:
 *         description: Activité sportive mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Activité sportive non trouvée
 */
router.put('/:id_activite_sportive', [
    body('type_activite')
        .isString()
        .notEmpty()
        .withMessage('Le type d\'activité est obligatoire'),
    body('date_activite')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage('La date de l\'activité doit être une date valide'),
    body('duree')
        .isNumeric()
        .withMessage('La durée de l\'activité doit être un nombre'),
    body('distance')
        .isNumeric()
        .withMessage('La distance parcourue doit être un nombre'),
    body('calories_brulees')
        .isNumeric()
        .withMessage('Le nombre de calories brûlées doit être un nombre'),
    body('id_utilisateur')
        .isNumeric()
        .withMessage('L\'ID de l\'utilisateur doit être un nombre'),
    body('id_objectif_sportif')
        .isNumeric()
        .withMessage('L\'ID de l\'objectif sportif doit être un nombre'),
], ActiviteSportiveController.updateActiviteSportive);

module.exports = router;