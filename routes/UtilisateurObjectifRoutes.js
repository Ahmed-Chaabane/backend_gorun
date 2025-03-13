const express = require('express');
const { body, param } = require('express-validator');
const UtilisateurObjectifController = require('../controllers/UtilisateurObjectifController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateur-Objectif
 *   description: Gestion des liens entre utilisateurs et objectifs sportifs
 */

// Récupérer tous les liens utilisateur-objectif
router.get('/', UtilisateurObjectifController.getAllUtilisateurObjectifs);

// Ajouter un lien utilisateur-objectif
router.post(
    '/',
    [
        body('id_objectif_sportif')
            .isInt().toInt()
            .withMessage("L'ID de l'objectif sportif doit être un entier valide."),
        body('date_debut')
            .isISO8601().toDate()
            .withMessage("La date de début doit être au format YYYY-MM-DD.")
            .custom((value) => {
                if (value.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                    throw new Error("La date de début doit être dans le futur.");
                }
                return true;
            }),
        body('date_fin')
            .isISO8601().toDate()
            .withMessage("La date de fin doit être au format YYYY-MM-DD.")
            .custom((value, { req }) => {
                if (value.setHours(0, 0, 0, 0) <= new Date(req.body.date_debut).setHours(0, 0, 0, 0)) {
                    throw new Error("La date de fin doit être postérieure à la date de début.");
                }
                return true;
            }),
        body('id_utilisateur')
            .isInt().toInt()
            .withMessage("L'ID de l'utilisateur doit être un entier valide."),
        body('etat')
            .notEmpty()
            .withMessage("L'état est obligatoire."),
        body('firebase_uid')
            .notEmpty()
            .withMessage("Le Firebase UID est obligatoire."),
    ],
    UtilisateurObjectifController.addUtilisateurObjectif
);

// Récupérer un lien utilisateur-objectif par ID
router.get(
    '/:id_utilisateur_objectif',
    [
        param('id_utilisateur_objectif')
            .isInt().toInt()
            .withMessage("L'ID doit être un entier valide."),
    ],
    UtilisateurObjectifController.getUtilisateurObjectifById
);

// Mettre à jour un lien utilisateur-objectif
router.put(
    '/:id_utilisateur_objectif',
    [
        param('id_utilisateur_objectif')
            .isInt().toInt()
            .withMessage("L'ID doit être un entier valide."),
        body('id_objectif_sportif').optional().isInt().toInt()
            .withMessage("L'ID de l'objectif sportif doit être un entier valide."),
        body('date_debut').optional()
            .isISO8601().toDate()
            .withMessage("La date de début doit être au format YYYY-MM-DD.")
            .custom((value) => {
                if (value && value.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                    throw new Error("La date de début doit être dans le futur.");
                }
                return true;
            }),
        body('date_fin').optional()
            .isISO8601().toDate()
            .withMessage("La date de fin doit être au format YYYY-MM-DD.")
            .custom((value, { req }) => {
                if (value && value.setHours(0, 0, 0, 0) <= new Date(req.body.date_debut).setHours(0, 0, 0, 0)) {
                    throw new Error("La date de fin doit être postérieure à la date de début.");
                }
                return true;
            }),
        body('id_utilisateur').optional().isInt().toInt()
            .withMessage("L'ID de l'utilisateur doit être un entier valide."),
        body('etat').optional().notEmpty()
            .withMessage("L'état est obligatoire si fourni."),
        body('firebase_uid').optional().notEmpty()
            .withMessage("Le Firebase UID est obligatoire si fourni."),
    ],
    UtilisateurObjectifController.updateUtilisateurObjectif
);

// Supprimer un lien utilisateur-objectif
router.delete(
    '/:id_utilisateur_objectif',
    [
        param('id_utilisateur_objectif')
            .isInt().toInt()
            .withMessage("L'ID doit être un entier valide."),
    ],
    UtilisateurObjectifController.deleteUtilisateurObjectif
);

module.exports = router;
