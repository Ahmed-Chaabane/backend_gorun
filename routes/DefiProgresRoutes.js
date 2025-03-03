const express = require('express');
const { body } = require('express-validator');
const DefiProgresController = require('../controllers/DefiProgresController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Progrès
 *   description: Gestion des progrès dans les défis communautaires
 */

/**
 * @swagger
 * /api/DefiProgres:
 *   get:
 *     summary: Obtenir tous les progrès triés par ID de défi
 *     tags: [Progrès]
 *     responses:
 *       200:
 *         description: Liste des progrès récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', DefiProgresController.getAllDefiProgres);

/**
 * @swagger
 * /api/DefiProgres:
 *   post:
 *     summary: Ajouter un progrès à un défi
 *     tags: [Progrès]
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
 *               progres:
 *                 type: number
 *                 description: Progrès réalisé
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date du progrès (au format YYYY-MM-DD)
 *     responses:
 *       201:
 *         description: Progrès ajouté avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('id_utilisateur')
            .isInt()
            .withMessage("id_utilisateur doit être un entier"),
        body('progres')
            .isDecimal()
            .withMessage("progres doit être un nombre décimal"),
        body('date')
            .isDate({ format: 'YYYY-MM-DD', strictMode: true })
            .withMessage("date doit être une date valide au format YYYY-MM-DD"),
    ],
    DefiProgresController.addDefiProgres
);

/**
 * @swagger
 * /api/DefiProgres/{id_defi}:
 *   get:
 *     summary: Obtenir les progrès d'un défi par ID du défi
 *     tags: [Progrès]
 *     parameters:
 *       - name: id_defi
 *         in: path
 *         required: true
 *         description: ID du défi
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progrès du défi récupérés avec succès
 *       404:
 *         description: Défi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_defi', DefiProgresController.getDefiProgresById);

/**
 * @swagger
 * /api/DefiProgres/{id_progres}:
 *   put:
 *     summary: Mettre à jour un progrès par ID
 *     tags: [Progrès]
 *     parameters:
 *       - name: id_progres
 *         in: path
 *         required: true
 *         description: ID du progrès
 *         schema:
 *           type: integer
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
 *               progres:
 *                 type: number
 *                 description: Progrès réalisé
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date du progrès (au format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Progrès mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Progrès non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_progres',
    [
        body('id_utilisateur')
            .isInt()
            .withMessage("id_utilisateur doit être un entier"),
        body('progres')
            .isDecimal()
            .withMessage("progres doit être un nombre décimal"),
        body('date')
            .isDate({ format: 'YYYY-MM-DD', strictMode: true })
            .withMessage("date doit être une date valide au format YYYY-MM-DD"),
    ],
    DefiProgresController.updateDefiProgres
);

/**
 * @swagger
 * /api/DefiProgres:
 *   delete:
 *     summary: Supprimer un progrès par ID
 *     tags: [Progrès]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_progres:
 *                 type: integer
 *                 description: ID du progrès à supprimer
 *     responses:
 *       200:
 *         description: Progrès supprimé avec succès
 *       404:
 *         description: Progrès non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/', DefiProgresController.deleteDefiProgres);

module.exports = router;