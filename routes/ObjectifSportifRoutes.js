const express = require('express');
const { body } = require('express-validator');
const ObjectifSportifRouiController = require('../controllers/ObjectifSportifController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Objectifs Sportifs
 *   description: Gestion des objectifs sportifs
 */

/**
 * @swagger
 * /api/objectifsportif:
 *   get:
 *     summary: Obtenir tous les objectifs sportifs
 *     tags: [Objectifs Sportifs]
 *     responses:
 *       200:
 *         description: Liste des objectifs sportifs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', ObjectifSportifRouiController.getAllObjectifSportif);

/**
 * @swagger
 * /api/objectifsportif:
 *   post:
 *     summary: Ajouter un objectif sportif
 *     tags: [Objectifs Sportifs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description de l'objectif
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'objectif
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'objectif
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur lié à l'objectif
 *               etat:
 *                 type: string
 *                 description: |
 *                   État de l'objectif :
 *                   - "en cours"
 *                   - "terminé"
 *                   - "annulé"
 *                   - etc.
 *     responses:
 *       201:
 *         description: Objectif sportif ajouté avec succès
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
        body('date_debut')
            .isISO8601()
            .toDate()
            .withMessage('La date de début doit être une date valide'),
        body('date_fin')
            .isISO8601()
            .toDate()
            .withMessage('La date de fin doit être une date valide'),
        body('id_utilisateur')
            .isInt()
            .withMessage('L\'ID de l\'utilisateur doit être un entier valide'),
        body('etat')
            .isString()
            .notEmpty()
            .withMessage('L\'état est obligatoire'),
    ],
    ObjectifSportifRouiController.addObjectifSportif
);

/**
 * @swagger
 * /api/objectifsportif/{id_objectif_sportif}:
 *   get:
 *     summary: Récupérer un objectif sportif par ID
 *     tags: [Objectifs Sportifs]
 *     parameters:
 *       - name: id_objectif_sportif
 *         in: path
 *         required: true
 *         description: ID de l'objectif sportif à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Objectif sportif récupéré avec succès
 *       404:
 *         description: Objectif sportif non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_objectif_sportif', ObjectifSportifRouiController.getObjectifSportifById);

/**
 * @swagger
 * /api/objectifsportif/{id_objectif_sportif}:
 *   put:
 *     summary: Mettre à jour un objectif sportif
 *     tags: [Objectifs Sportifs]
 *     parameters:
 *       - name: id_objectif_sportif
 *         in: path
 *         required: true
 *         description: ID de l'objectif sportif à mettre à jour
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
 *                 description: Description de l'objectif
 *               date_debut:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'objectif
 *               date_fin:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'objectif
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur lié à l'objectif
 *               etat:
 *                 type: string
 *                 description: |
 *                   État de l'objectif :
 *                   - "en cours"
 *                   - "terminé"
 *                   - "annulé"
 *                   - etc.
 *     responses:
 *       200:
 *         description: Objectif sportif mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Objectif sportif non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_objectif_sportif',
    [
        body('description')
            .isString()
            .notEmpty()
            .withMessage('La description est obligatoire'),
        body('date_debut')
            .isISO8601()
            .toDate()
            .withMessage('La date de début doit être une date valide'),
        body('date_fin')
            .isISO8601()
            .toDate()
            .withMessage('La date de fin doit être une date valide'),
        body('id_utilisateur')
            .isInt()
            .withMessage('L\'ID de l\'utilisateur doit être un entier valide'),
        body('etat')
            .isString()
            .notEmpty()
            .withMessage('L\'état est obligatoire'),
    ],
    ObjectifSportifRouiController.updateObjectifSportif
);

/**
 * @swagger
 * /api/objectifsportif/{id_objectif_sportif}:
 *   delete:
 *     summary: Supprimer un objectif sportif
 *     tags: [Objectifs Sportifs]
 *     parameters:
 *       - name: id_objectif_sportif
 *         in: path
 *         required: true
 *         description: ID de l'objectif sportif à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Objectif sportif supprimé avec succès
 *       404:
 *         description: Objectif sportif non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_objectif_sportif', ObjectifSportifRouiController.deleteObjectifSportif);

module.exports = router;