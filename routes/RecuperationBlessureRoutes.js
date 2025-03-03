const express = require('express'); // Importation du framework express
const { body } = require('express-validator'); // Validation des données
const RecuperationBlessureController = require('../controllers/RecuperationBlessureController'); // Importation du contrôleur
const router = express.Router(); // Création d'un routeur express

/**
 * @swagger
 * tags:
 *   name: Récupérations Blessures
 *   description: Gestion des récupérations de blessures
 */

/**
 * @swagger
 * /api/recuperationblessure:
 *   get:
 *     summary: Obtenir toutes les récupérations de blessures
 *     tags: [Récupérations Blessures]
 *     responses:
 *       200:
 *         description: Liste des récupérations de blessures récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', RecuperationBlessureController.getAllRecuperationBlessure);

/**
 * @swagger
 * /api/recuperationblessure:
 *   post:
 *     summary: Ajouter une récupération de blessure
 *     tags: [Récupérations Blessures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_blessure:
 *                 type: string
 *                 description: Type de blessure
 *               date_blessure:
 *                 type: string
 *                 description: Date de blessure
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               niveau_gravite:
 *                 type: integer
 *                 description: Niveau de gravité de la blessure
 *               statut:
 *                 type: string
 *                 description: Statut de la blessure (par exemple, en cours, guérie, etc.)
 *     responses:
 *       201:
 *         description: Récupération de blessure ajoutée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post(
    '/',
    [
        body('type_blessure')
            .isString()
            .notEmpty()
            .withMessage('Le type de blessure est obligatoire'),
        body('date_blessure')
            .isString()
            .notEmpty()
            .withMessage('La date de blessure est obligatoire'),
        body('id_utilisateur')
            .isInt()
            .notEmpty()
            .withMessage('L\'ID de l\'utilisateur est obligatoire'),
        body('niveau_gravite')
            .isInt()
            .notEmpty()
            .withMessage('Le niveau de gravité est obligatoire'),
        body('statut')
            .isString()
            .notEmpty()
            .withMessage('Le statut est obligatoire'),
    ],
    RecuperationBlessureController.addRecuperationBlessure
);

/**
 * @swagger
 * /api/recuperationblessure/{id_recuperation_blessure}:
 *   get:
 *     summary: Récupérer une récupération de blessure par son ID
 *     tags: [Récupérations Blessures]
 *     parameters:
 *       - name: id_recuperation_blessure
 *         in: path
 *         required: true
 *         description: ID de la récupération de blessure à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Récupération de blessure récupérée avec succès
 *       404:
 *         description: Récupération de blessure non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_recuperation_blessure', RecuperationBlessureController.getRecuperationBlessureById);

/**
 * @swagger
 * /api/recuperationblessure/{id_recuperation_blessure}:
 *   put:
 *     summary: Mettre à jour une récupération de blessure
 *     tags: [Récupérations Blessures]
 *     parameters:
 *       - name: id_recuperation_blessure
 *         in: path
 *         required: true
 *         description: ID de la récupération de blessure à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_blessure:
 *                 type: string
 *                 description: Type de blessure
 *               date_blessure:
 *                 type: string
 *                 description: Date de blessure
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               niveau_gravite:
 *                 type: integer
 *                 description: Niveau de gravité de la blessure
 *               statut:
 *                 type: string
 *                 description: Statut de la blessure
 *     responses:
 *       200:
 *         description: Récupération de blessure mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Récupération de blessure non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id_recuperation_blessure', RecuperationBlessureController.updateRecuperationBlessure);

/**
 * @swagger
 * /api/recuperationblessure/{id_recuperation_blessure}:
 *   delete:
 *     summary: Supprimer une récupération de blessure
 *     tags: [Récupérations Blessures]
 *     parameters:
 *       - name: id_recuperation_blessure
 *         in: path
 *         required: true
 *         description: ID de la récupération de blessure à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Récupération de blessure supprimée avec succès
 *       404:
 *         description: Récupération de blessure non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id_recuperation_blessure', RecuperationBlessureController.deleteRecuperationBlessure);

module.exports = router;