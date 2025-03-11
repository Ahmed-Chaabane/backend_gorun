const express = require('express');
const { body, validationResult } = require('express-validator');
const utilisateurController = require('../controllers/utilisateurController');
const { checkDuplicateEntry } = require('../utils/checkDuplicateEntry');
const Utilisateur = require('../models/Utilisateur'); // Importer le modèle Utilisateur

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

// Obtenir tous les utilisateurs
router.get('/', utilisateurController.getAllUtilisateurs);

// Ajouter un utilisateur
router.post('/',
    [
        body('nom').notEmpty().withMessage('Le champ nom est requis.'),
        body('prenom').notEmpty().withMessage('Le champ prenom est requis.'),
        body('email').isEmail().withMessage('L\'email doit être valide.'),
        body('telephone').optional().isMobilePhone().withMessage('Le téléphone doit être un numéro valide.'),
        body('firebase_uid').notEmpty().withMessage('L\'UID Firebase est requis.')  // Ajout de la validation pour firebase_uid
    ],
    async (req, res) => {
        try {
            // Vérification que le corps de la requête n'est pas vide
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Le corps de la requête est vide ou mal formé.' });
            }

            const { nom, prenom, email, telephone, firebase_uid } = req.body;

            // Validation des données
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Vérification de la duplication des emails et des numéros de téléphone
            try {
                await checkDuplicateEntry('email', email);
                if (telephone) {
                    await checkDuplicateEntry('telephone', telephone);
                }
            } catch (error) {
                return res.status(409).json({ error: 'Doublon détecté', details: error.message });
            }

            // Ajout de l'utilisateur dans la base de données locale
            const newUser = await utilisateurController.addUtilisateur({
                nom,
                prenom,
                email,
                telephone,
                firebase_uid,  // Assurez-vous d'envoyer l'UID Firebase
            });

            return res.status(201).json({
                message: 'Utilisateur créé avec succès!',
                utilisateur: {
                    id_utilisateur: newUser.id_utilisateur,
                    nom: newUser.nom,
                    prenom: newUser.prenom,
                    email: newUser.email,
                    telephone: newUser.telephone,
                    statut: newUser.statut,
                    date_inscription: newUser.date_inscription,
                }
            });

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            return res.status(500).json({ error: 'Erreur lors de l’enregistrement', details: error.message });
        }
    }
);

// Obtenir un utilisateur par email
router.get('/email/:email', utilisateurController.getUtilisateurByEmail);

// Obtenir un utilisateur par ID
router.get('/:id_utilisateur', utilisateurController.getUtilisateurById);

// Obtenir un utilisateur par UID Firebase
router.get('/firebase_uid/:firebase_uid', utilisateurController.getUtilisateurByFirebaseUid);

// Mettre à jour un utilisateur
router.put(
    '/:id_utilisateur',
    [
        body('email').optional().isEmail().withMessage('Adresse email invalide'),
        body('age').optional().isInt({ min: 18 }).withMessage('L\'âge doit être supérieur ou égal à 18'),
    ],
    (req, res, next) => {
        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Si aucune erreur, passer au contrôleur
        utilisateurController.updateUtilisateur(req, res, next);
    }
);

// Route pour mettre à jour les détails de l'utilisateur
router.put('/update_user_details/:firebase_uid', async (req, res) => {
    const { firebase_uid } = req.params;
    const {
        nom, prenom, email, taille, poids, age, date_naissance, role, statut,
        telephone, sexe, selectedSports, preferences_sportives, lieux_pratique,
        frequence_entrainement, health_conditions, regime_alimentaire, objectifs_amelioration
    } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ where: { firebase_uid } });
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérification du téléphone (évite les doublons)
        if (telephone) {
            const existingUser = await Utilisateur.findOne({ where: { telephone } });
            if (existingUser && existingUser.id_utilisateur !== utilisateur.id_utilisateur) {
                return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé' });
            }
        }

        // Préparer les données de mise à jour, en conservant les valeurs actuelles si non fournies
        const updateData = {
            nom: nom || utilisateur.nom,
            prenom: prenom || utilisateur.prenom,
            email: email || utilisateur.email,
            telephone: telephone || utilisateur.telephone,
            taille: taille || utilisateur.taille,
            poids: poids || utilisateur.poids,
            age: age || utilisateur.age,
            date_naissance: date_naissance || utilisateur.date_naissance,
            role: role || utilisateur.role,
            statut: statut || utilisateur.statut,
            sexe: sexe || utilisateur.sexe,
            selectedSports: Array.isArray(selectedSports) ? selectedSports : utilisateur.selectedSports,
            preferences_sportives: Array.isArray(preferences_sportives) ? preferences_sportives : utilisateur.preferences_sportives,
            lieux_pratique: Array.isArray(lieux_pratique) ? lieux_pratique : utilisateur.lieux_pratique,
            frequence_entrainement: typeof frequence_entrainement === 'string'
                ? frequence_entrainement.trim()
                : utilisateur.frequence_entrainement,
            health_conditions: Array.isArray(health_conditions) ? health_conditions : utilisateur.health_conditions,
            regime_alimentaire: typeof regime_alimentaire=== 'string'
                ? regime_alimentaire.trim()
                : utilisateur.regime_alimentaire,
            objectifs_amelioration: Array.isArray(objectifs_amelioration) ? objectifs_amelioration : utilisateur.objectifs_amelioration,
        };

        // Mise à jour des informations utilisateur
        await utilisateur.update(updateData);

        console.log("Données mises à jour:", updateData);

        return res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            utilisateur: updateData
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour', details: error.message });
    }
});

// Route pour obtenir les données utilisateur pour l'apprentissage automatique
exports.getUserDataForML = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.findAll({
            attributes: ['firebase_uid', 'taille', 'poids', 'age', 'sexe', 'selectedSports', 'preferences_sportives', 'frequence_entrainement', 'health_conditions', 'regime_alimentaire', 'objectifs_amelioration']
        });

        res.json(utilisateurs);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un utilisateur
router.delete('/:id_utilisateur', utilisateurController.deleteUtilisateur);

module.exports = router;
