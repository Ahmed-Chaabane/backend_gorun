const express = require('express');
const { body, validationResult } = require('express-validator');
const ActiviteSportiveController = require('../controllers/ActiviteSportiveController');
const router = express.Router();

/**
 * Récupérer toutes les activités sportives
 */
router.get('/', ActiviteSportiveController.getAllActivitesSportives);

/**
 * Ajouter une nouvelle activité sportive
 */
router.post('/', [
    body('type_activite')
        .isString()
        .notEmpty()
        .withMessage('Le type d\'activité est obligatoire'),
    body('date_activite')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage('La date de l\'activité doit être une date valide'),
    body('duree')
        .isNumeric()
        .withMessage('La durée doit être un nombre'),
    body('distance')
        .isNumeric()
        .withMessage('La distance doit être un nombre'),
    body('calories_brulees')
        .isNumeric()
        .withMessage('Les calories brûlées doivent être un nombre'),
    body('id_utilisateur')
        .isNumeric()
        .withMessage('L\'ID utilisateur doit être un nombre'),
    body('id_objectif_sportif')
        .isNumeric()
        .withMessage('L\'ID de l\'objectif sportif doit être un nombre'),
    body('latitude_debut')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Latitude de début invalide'),
    body('longitude_debut')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Longitude de début invalide'),
    body('latitude_fin')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Latitude de fin invalide'),
    body('longitude_fin')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Longitude de fin invalide'),
    body('details_raw')
        .optional({ nullable: true })
        .isString()
        .withMessage('Les détails doivent être une chaîne de caractères'),
    body('date_heure')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('Date et heure invalide')
], ActiviteSportiveController.addActiviteSportive);

/**
 * Récupérer une activité sportive par ID
 */
router.get('/:id_activite_sportive', ActiviteSportiveController.getActiviteSportiveById);

/**
 * Mettre à jour une activité sportive
 */
router.put('/:id_activite_sportive', [
    body('type_activite')
        .isString()
        .notEmpty()
        .withMessage('Le type d\'activité est obligatoire'),
    body('date_activite')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage('La date de l\'activité doit être une date valide'),
    body('duree')
        .isNumeric()
        .withMessage('La durée doit être un nombre'),
    body('distance')
        .isNumeric()
        .withMessage('La distance doit être un nombre'),
    body('calories_brulees')
        .isNumeric()
        .withMessage('Les calories brûlées doivent être un nombre'),
    body('id_utilisateur')
        .isNumeric()
        .withMessage('L\'ID utilisateur doit être un nombre'),
    body('id_objectif_sportif')
        .isNumeric()
        .withMessage('L\'ID de l\'objectif sportif doit être un nombre'),
    body('latitude_debut')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Latitude de début invalide'),
    body('longitude_debut')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Longitude de début invalide'),
    body('latitude_fin')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Latitude de fin invalide'),
    body('longitude_fin')
        .optional({ nullable: true })
        .isFloat()
        .withMessage('Longitude de fin invalide'),
    body('details_raw')
        .optional({ nullable: true })
        .isString()
        .withMessage('Les détails doivent être une chaîne de caractères'),
    body('date_heure')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('Date et heure invalide')
], ActiviteSportiveController.updateActiviteSportive);

/**
 * Supprimer une activité sportive
 */
router.delete('/:id_activite_sportive', ActiviteSportiveController.deleteActivitesSportive);

// Dans votre fichier de routes (ActiviteSportiveRoutes.js)
router.get('/user/activities', ActiviteSportiveController.getUserActivities); // 🔹 Récupérer les activités par firebase_uid

module.exports = router;
