const express = require('express');
const { body, param } = require('express-validator');

const ObjectifSportifController = require('../controllers/ObjectifSportifController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Objectifs Sportifs
 *   description: Gestion des objectifs sportifs
 */

// Récupérer tous les objectifs sportifs
/**
 * @swagger
 * /api/objectifsportif:
 *   get:
 *     summary: Obtenir tous les objectifs sportifs
 *     tags: [Objectifs Sportifs]
 *     responses:
 *       200:
 *         description: Liste des objectifs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', ObjectifSportifController.getAllObjectifSportif);

// Ajouter un objectif sportif
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
 *               name:
 *                 type: string
 *                 description: Nom de l'objectif
 *               icon:
 *                 type: string
 *                 description: Nom de l'icône associée à l'objectif
 *     responses:
 *       201:
 *         description: Objectif ajouté avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('description').notEmpty().withMessage("La description est obligatoire."),
        body('name').notEmpty().withMessage("Le nom est obligatoire."),
        body('icon').notEmpty().withMessage("L'icône est obligatoire."),
    ],
    ObjectifSportifController.addObjectifSportif
);

// Récupérer un objectif sportif par ID
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
 *         description: Objectif récupéré avec succès
 *       404:
 *         description: Objectif non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get(
    '/:id_objectif_sportif',
    [
        param('id_objectif_sportif').isInt().withMessage("L'ID doit être un entier."),
    ],
    ObjectifSportifController.getObjectifSportifById
);

// Mettre à jour un objectif sportif
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
 *                 description: Nouvelle description de l'objectif
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'objectif
 *               icon:
 *                 type: string
 *                 description: Nouvelle icône associée à l'objectif
 *     responses:
 *       200:
 *         description: Objectif mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Objectif non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_objectif_sportif',
    [
        param('id_objectif_sportif').isInt().withMessage("L'ID doit être un entier."),
        body('description').optional().notEmpty().withMessage("La description est obligatoire si fournie."),
        body('name').optional().notEmpty().withMessage("Le nom est obligatoire si fourni."),
        body('icon').optional().notEmpty().withMessage("L'icône est obligatoire si fournie."),
    ],
    ObjectifSportifController.updateObjectifSportif
);

// Supprimer un objectif sportif
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
 *         description: Objectif supprimé avec succès
 *       404:
 *         description: Objectif non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete(
    '/:id_objectif_sportif',
    [
        param('id_objectif_sportif').isInt().withMessage("L'ID doit être un entier."),
    ],
    ObjectifSportifController.deleteObjectifSportif
);

module.exports = router;