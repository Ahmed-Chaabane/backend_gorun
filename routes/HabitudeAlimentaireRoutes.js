const express = require('express');
const { body } = require('express-validator');
const HabitudeAlimentaireController = require('../controllers/HabitudeAlimentaireController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Habitudes Alimentaires
 *   description: Gestion des habitudes alimentaires
 */

/**
 * @swagger
 * /api/habitudealimentaire:
 *   get:
 *     summary: Obtenir toutes les habitudes alimentaires
 *     tags: [Habitudes Alimentaires]
 *     responses:
 *       200:
 *         description: Liste des habitudes alimentaires récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', HabitudeAlimentaireController.getAllHabitudeAlimentairesController);

/**
 * @swagger
 * /api/habitudealimentaire:
 *   post:
 *     summary: Ajouter une habitude alimentaire
 *     tags: [Habitudes Alimentaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_aliment:
 *                 type: string
 *                 description: Type d'aliment
 *               quantite:
 *                 type: number
 *                 format: float
 *                 description: Quantité d'aliment
 *               date_habitude_alimentaire:
 *                 type: string
 *                 format: date
 *                 description: Date de l'habitude alimentaire au format ISO 8601 (YYYY-MM-DD)
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               id_aliment:
 *                 type: integer
 *                 description: ID de l'aliment
 *     responses:
 *       201:
 *         description: Habitude alimentaire ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
            body('type_aliment')
                .isString()
                .notEmpty()
                .withMessage('Le type d\'aliment est obligatoire et doit être une chaîne de caractères.'),
            body('quantite')
                .isNumeric()
                .notEmpty()
                .withMessage('La quantité est obligatoire et doit être un nombre.'),
            body('date_habitude_alimentaire')
                .isISO8601()
                .withMessage('La date de l\'habitude alimentaire doit être au format ISO 8601 (YYYY-MM-DD).'),
            body('id_utilisateur')
                .isInt()
                .notEmpty()
                .withMessage('L\'ID de l\'utilisateur est obligatoire et doit être un entier.'),
            body('id_aliment')
                .isInt()
                .notEmpty()
                .withMessage('L\'ID de l\'aliment est obligatoire et doit être un entier.'),
    ],
    HabitudeAlimentaireController.addHabitudeAlimentaire
);

/**
 * @swagger
 * /api/habitudealimentaire/{id_habitude_alimentaire}:
 *   get:
 *     summary: Obtenir une habitude alimentaire par ID
 *     tags: [Habitudes Alimentaires]
 *     parameters:
 *       - name: id_habitude_alimentaire
 *         in: path
 *         required: true
 *         description: ID de l'habitude alimentaire à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habitude alimentaire récupérée avec succès
 *       404:
 *         description: Habitude alimentaire non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_habitude_alimentaire', HabitudeAlimentaireController.getHabitudeAlimentaireById);

/**
 * @swagger
 * /api/habitudealimentaire/{id_habitude_alimentaire}:
 *   put:
 *     summary: Mettre à jour une habitude alimentaire
 *     tags: [Habitudes Alimentaires]
 *     parameters:
 *       - name: id_habitude_alimentaire
 *         in: path
 *         required: true
 *         description: ID de l'habitude alimentaire à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_aliment:
 *                 type: string
 *                 description: Type d'aliment
 *               quantite:
 *                 type: number
 *                 format: float
 *                 description: Quantité d'aliment
 *               date_habitude_alimentaire:
 *                 type: string
 *                 format: date
 *                 description: Date de l'habitude alimentaire au format ISO 8601 (YYYY-MM-DD)
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               id_aliment:
 *                 type: integer
 *                 description: ID de l'aliment
 *     responses:
 *       200:
 *         description: Habitude alimentaire mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Habitude alimentaire non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put(
    '/:id_habitude_alimentaire',
    [
            body('type_aliment')
                .isString()
                .notEmpty()
                .withMessage('Le type d\'aliment est obligatoire et doit être une chaîne de caractères.'),
            body('quantite')
                .isNumeric()
                .notEmpty()
                .withMessage('La quantité est obligatoire et doit être un nombre.'),
            body('date_habitude_alimentaire')
                .isISO8601()
                .withMessage('La date de l\'habitude alimentaire doit être au format ISO 8601 (YYYY-MM-DD).'),
            body('id_utilisateur')
                .isInt()
                .notEmpty()
                .withMessage('L\'ID de l\'utilisateur est obligatoire et doit être un entier.'),
            body('id_aliment')
                .isInt()
                .notEmpty()
                .withMessage('L\'ID de l\'aliment est obligatoire et doit être un entier.'),
    ],
    HabitudeAlimentaireController.updateHabitudeAliment
);

/**
 * @swagger
 * /api/habitudealimentaire/{id_habitude_alimentaire}:
 *   delete:
 *     summary: Supprimer une habitude alimentaire
 *     tags: [Habitudes Alimentaires]
 *     parameters:
 *       - name: id_habitude_alimentaire
 *         in: path
 *         required: true
 *         description: ID de l'habitude alimentaire à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habitude alimentaire supprimée avec succès
 *       404:
 *         description: Habitude alimentaire non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_habitude_alimentaire', HabitudeAlimentaireController.deleteHabitudeAlimentaire);

module.exports = router;