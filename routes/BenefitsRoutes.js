const express = require('express');
const { body, validationResult } = require('express-validator'); // validation de données
const BenefitsController = require('../Controllers/BenefitsController'); // Importer le contrôleur Benefits
const router = express.Router();

// Obtenir tous les benefits
router.get('/', BenefitsController.getAllBenefits);

// Ajouter un benefit
router.post(
    '/',
    [
        // Validation des données
        body('name').notEmpty().withMessage('Le nom est requis'),
        body('icon').notEmpty().withMessage('L\'icône est requise'),
    ],
    BenefitsController.addBenefit
);

// Récupérer un benefit par son ID
router.get('/:id', BenefitsController.getBenefitById);

// Mettre à jour un benefit
router.put('/:id', BenefitsController.updateBenefit);

// Supprimer un benefit
router.delete('/:id', BenefitsController.deleteBenefit);

module.exports = router;
