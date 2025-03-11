const express = require('express');
const sleepGoalController = require('../controllers/sleepGoalController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SleepGoals
 *   description: Gestion des objectifs de sommeil
 */

// Récupérer tous les objectifs de sommeil
/**
 * @swagger
 * /api/sleepgoals:
 *   get:
 *     summary: Récupérer tous les objectifs de sommeil
 *     tags: [SleepGoals]
 *     responses:
 *       200:
 *         description: Liste des objectifs de sommeil récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', sleepGoalController.getAllSleepGoals);

// Ajouter un nouvel objectif de sommeil
/**
 * @swagger
 * /api/sleepgoals:
 *   post:
 *     summary: Ajouter un nouvel objectif de sommeil
 *     tags: [SleepGoals]
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
 *               required_hours:
 *                 type: integer
 *               quality_goal:
 *                 type: integer
 *               sport_type:
 *                 type: string
 *             required:
 *               - name
 *               - icon
 *               - description
 *               - required_hours
 *     responses:
 *       201:
 *         description: Objectif de sommeil créé avec succès
 *       400:
 *         description: Données invalides ou manquantes
 *       500:
 *         description: Erreur serveur
 */
router.post('/', sleepGoalController.createSleepGoal);

// Récupérer un objectif de sommeil par ID
/**
 * @swagger
 * /api/sleepgoals/{id}:
 *   get:
 *     summary: Récupérer un objectif de sommeil par ID
 *     tags: [SleepGoals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif de sommeil
 *     responses:
 *       200:
 *         description: Objectif de sommeil récupéré avec succès
 *       404:
 *         description: Objectif de sommeil non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', sleepGoalController.getSleepGoalById);

// Mettre à jour un objectif de sommeil par ID
/**
 * @swagger
 * /api/sleepgoals/{id}:
 *   put:
 *     summary: Mettre à jour un objectif de sommeil par ID
 *     tags: [SleepGoals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif de sommeil
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
 *               required_hours:
 *                 type: integer
 *               quality_goal:
 *                 type: integer
 *               sport_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objectif de sommeil mis à jour avec succès
 *       404:
 *         description: Objectif de sommeil non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', sleepGoalController.updateSleepGoal);

// Supprimer un objectif de sommeil par ID
/**
 * @swagger
 * /api/sleepgoals/{id}:
 *   delete:
 *     summary: Supprimer un objectif de sommeil par ID
 *     tags: [SleepGoals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif de sommeil
 *     responses:
 *       200:
 *         description: Objectif de sommeil supprimé avec succès
 *       404:
 *         description: Objectif de sommeil non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', sleepGoalController.deleteSleepGoal);

module.exports = router;