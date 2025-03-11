const express = require('express');
const nutritionGoalController = require('../controllers/nutritionGoalController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NutritionGoals
 *   description: Gestion des objectifs nutritionnels
 */

// Récupérer tous les objectifs nutritionnels
/**
 * @swagger
 * /api/nutritiongoal:
 *   get:
 *     summary: Récupérer tous les objectifs nutritionnels
 *     tags: [NutritionGoals]
 *     responses:
 *       200:
 *         description: Liste des objectifs nutritionnels récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', nutritionGoalController.getAllNutritionGoals);

// Ajouter un nouvel objectif nutritionnel
/**
 * @swagger
 * /api/nutritiongoal:
 *   post:
 *     summary: Ajouter un nouvel objectif nutritionnel
 *     tags: [NutritionGoals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               description:
 *                 type: string
 *               required_meals:
 *                 type: integer
 *             required:
 *               - name
 *               - icon
 *               - description
 *               - required_meals
 *     responses:
 *       201:
 *         description: Objectif nutritionnel créé avec succès
 *       400:
 *         description: Données invalides ou manquantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/', nutritionGoalController.addNutritionGoal);

// Récupérer un objectif nutritionnel par ID
/**
 * @swagger
 * /api/nutritiongoal/{id}:
 *   get:
 *     summary: Récupérer un objectif nutritionnel par ID
 *     tags: [NutritionGoals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif nutritionnel
 *     responses:
 *       200:
 *         description: Objectif nutritionnel récupéré avec succès
 *       404:
 *         description: Objectif nutritionnel non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', nutritionGoalController.getNutritionGoalById);

// Mettre à jour un objectif nutritionnel par ID
/**
 * @swagger
 * /api/nutritiongoal/{id}:
 *   put:
 *     summary: Mettre à jour un objectif nutritionnel par ID
 *     tags: [NutritionGoals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif nutritionnel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *               description:
 *                 type: string
 *               required_meals:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Objectif nutritionnel mis à jour avec succès
 *       404:
 *         description: Objectif nutritionnel non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', nutritionGoalController.updateNutritionGoal);

// Supprimer un objectif nutritionnel par ID
/**
 * @swagger
 * /api/nutritiongoal/{id}:
 *   delete:
 *     summary: Supprimer un objectif nutritionnel par ID
 *     tags: [NutritionGoals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif nutritionnel
 *     responses:
 *       200:
 *         description: Objectif nutritionnel supprimé avec succès
 *       404:
 *         description: Objectif nutritionnel non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', nutritionGoalController.deleteNutritionGoal);

module.exports = router;