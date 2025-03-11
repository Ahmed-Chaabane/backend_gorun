const express = require('express');
const utilisateurHydrationController = require('../controllers/utilisateurHydrationController');
const UtilisateurHydration = require('../models/UtilisateurHydration');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UtilisateurHydrations
 *   description: Gestion des relations entre utilisateurs et objectifs d'hydratation
 */

/**
 * @swagger
 * /utilisateur-hydrations:
 *   post:
 *     summary: Ajouter une relation utilisateur-objectif d'hydratation
 *     tags: [UtilisateurHydrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *               id_hydration_goal:
 *                 type: integer
 *               firebase_uid:
 *                 type: string
 *             example:
 *               id_utilisateur: 1
 *               id_hydration_goal: 1
 *               firebase_uid: "abc123"
 *     responses:
 *       201:
 *         description: Relation utilisateur-objectif d'hydratation créée avec succès
 *       400:
 *         description: Tous les champs sont nécessaires
 *       404:
 *         description: Utilisateur ou objectif d'hydratation non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', utilisateurHydrationController.addUtilisateurHydration);

/**
 * @swagger
 * /utilisateur-hydrations/{id_utilisateur}:
 *   get:
 *     summary: Récupérer les objectifs d'hydratation d'un utilisateur par son id_utilisateur
 *     tags: [UtilisateurHydrations]
 *     parameters:
 *       - in: path
 *         name: id_utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des objectifs d'hydratation de l'utilisateur
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id_utilisateur', utilisateurHydrationController.getHydrationGoalsByUtilisateur);

/**
 * @swagger
 * /utilisateur-hydrations/firebase/{firebase_uid}:
 *   get:
 *     summary: Récupérer les objectifs d'hydratation d'un utilisateur par son firebase_uid
 *     tags: [UtilisateurHydrations]
 *     parameters:
 *       - in: path
 *         name: firebase_uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Firebase UID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des objectifs d'hydratation de l'utilisateur
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/firebase/:firebase_uid', utilisateurHydrationController.getHydrationGoalsByFirebaseUid);

/**
 * @swagger
 * /utilisateur-hydrations/{id_utilisateur}/{id_hydration_goal}:
 *   delete:
 *     summary: Supprimer une relation utilisateur-objectif d'hydratation
 *     tags: [UtilisateurHydrations]
 *     parameters:
 *       - in: path
 *         name: id_utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: id_hydration_goal
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'objectif d'hydratation
 *     responses:
 *       200:
 *         description: Relation utilisateur-objectif d'hydratation supprimée avec succès
 *       404:
 *         description: Relation utilisateur-objectif d'hydratation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/firebase/:firebase_uid/:id_hydration_goal', utilisateurHydrationController.deleteUtilisateurHydration);

/**
 * @swagger
 * /utilisateur-hydrations:
 *   get:
 *     summary: Récupérer toutes les relations utilisateur-objectif d'hydratation
 *     tags: [UtilisateurHydrations]
 *     responses:
 *       200:
 *         description: Liste de toutes les relations utilisateur-objectif d'hydratation
 *       500:
 *         description: Erreur serveur
 */
router.get('/', utilisateurHydrationController.getAllUtilisateurHydrations);

// Mettre à jour l'état is_active d'un objectif d'hydratation
router.patch('/firebase/:firebase_uid', async (req, res) => {
    try {
        const { firebase_uid } = req.params;
        const { is_active } = req.body;

        // Vérifier que is_active est fourni
        if (is_active === undefined) {
            return res.status(400).json({ error: 'Le champ is_active est requis' });
        }

        // Trouver et mettre à jour l'objectif d'hydratation
        const updated = await UtilisateurHydration.update(
            { is_active },
            { where: { firebase_uid } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Objectif d\'hydratation non trouvé' });
        }

        res.json({ message: 'Objectif d\'hydratation mis à jour avec succès' });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;