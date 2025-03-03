const express = require('express');
const { body } = require('express-validator');
const InteractionController = require('../controllers/InteractionsController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Interactions
 *   description: Gestion des interactions
 */

/**
 * @swagger
 * /api/interactions:
 *   get:
 *     summary: Obtenir toutes les interactions
 *     tags: [Interactions]
 *     responses:
 *       200:
 *         description: Liste des interactions récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', InteractionController.getAllInteractions);

/**
 * @swagger
 * /api/interactions:
 *   post:
 *     summary: Ajouter une interaction
 *     tags: [Interactions]
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
 *               type_interaction:
 *                 type: string
 *                 description: Type d'interaction
 *               id_defi:
 *                 type: integer
 *                 description: ID du défi (facultatif)
 *               commentaire:
 *                 type: string
 *                 description: Commentaire lié à l'interaction (facultatif)
 *               date_interaction:
 *                 type: string
 *                 format: date
 *                 description: Date de l'interaction au format ISO 8601
 *     responses:
 *       201:
 *         description: Interaction ajoutée avec succès
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
            .withMessage('L\'ID utilisateur doit être un entier'),
        body('type_interaction')
            .isString()
            .notEmpty()
            .withMessage('Le type d\'interaction est obligatoire'),
        body('id_defi')
            .optional()
            .isInt()
            .withMessage('L\'ID défi doit être un entier'),
        body('commentaire')
            .optional()
            .isString(),
        body('date_interaction')
            .isDate()
            .withMessage('La date doit être valide'),
    ],
    InteractionController.addInteraction
);

/**
 * @swagger
 * /api/interactions/{id_interaction}:
 *   get:
 *     summary: Récupérer une interaction par ID
 *     tags: [Interactions]
 *     parameters:
 *       - name: id_interaction
 *         in: path
 *         required: true
 *         description: ID de l'interaction à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interaction récupérée avec succès
 *       404:
 *         description: Interaction non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_interaction', async (req, res) => {
    const { id_interaction } = req.params;
    try {
        const interaction = await Interaction.findByPk(id_interaction);
        if (interaction) {
            res.json(interaction);
        } else {
            res.status(404).json({ error: 'Interaction non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /api/interactions/{id_interaction}:
 *   put:
 *     summary: Mettre à jour une interaction
 *     tags: [Interactions]
 *     parameters:
 *       - name: id_interaction
 *         in: path
 *         required: true
 *         description: ID de l'interaction à mettre à jour
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
 *               type_interaction:
 *                 type: string
 *                 description: Type d'interaction
 *               id_defi:
 *                 type: integer
 *                 description: ID du défi (facultatif)
 *               commentaire:
 *                 type: string
 *                 description: Commentaire lié à l'interaction (facultatif)
 *               date_interaction:
 *                 type: string
 *                 format: date
 *                 description: Date de l'interaction au format ISO 8601
 *     responses:
 *       200:
 *         description: Interaction mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Interaction non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_interaction',
    [
        body('id_utilisateur')
            .isInt()
            .withMessage('L\'ID utilisateur doit être un entier'),
        body('type_interaction')
            .isString()
            .notEmpty()
            .withMessage('Le type d\'interaction est obligatoire'),
        body('id_defi')
            .optional()
            .isInt()
            .withMessage('L\'ID défi doit être un entier'),
        body('commentaire')
            .optional()
            .isString(),
        body('date_interaction')
            .isDate()
            .withMessage('La date doit être valide'),
    ],
    InteractionController.updateInteraction
);

/**
 * @swagger
 * /api/interactions/{id_interaction}:
 *   delete:
 *     summary: Supprimer une interaction
 *     tags: [Interactions]
 *     parameters:
 *       - name: id_interaction
 *         in: path
 *         required: true
 *         description: ID de l'interaction à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Interaction supprimée avec succès
 *       404:
 *         description: Interaction non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_interaction', InteractionController.deleteInteraction);

module.exports = router;