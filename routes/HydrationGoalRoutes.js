const express = require('express');
const hydrationGoalController = require('../controllers/hydrationGoalController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HydrationGoals
 *   description: Gestion des objectifs d'hydratation
 */

// Récupérer tous les objectifs d'hydratation
router.get('/', hydrationGoalController.getAllHydrationGoals);

// Ajouter un nouvel objectif d'hydratation
router.post('/', hydrationGoalController.addHydrationGoal);

// Récupérer un objectif d'hydratation par ID
router.get('/:id', hydrationGoalController.getHydrationGoalById);

// Mettre à jour un objectif d'hydratation par ID
router.put('/:id', hydrationGoalController.updateHydrationGoal);

// Supprimer un objectif d'hydratation par ID
router.delete('/:id', hydrationGoalController.deleteHydrationGoal);

module.exports = router;
