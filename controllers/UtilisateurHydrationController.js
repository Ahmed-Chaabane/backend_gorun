const UtilisateurHydration = require('../models/UtilisateurHydration');
const Utilisateur = require('../models/Utilisateur');
const HydrationGoal = require('../models/HydrationGoal');

// Récupérer toutes les relations utilisateur-objectif d'hydratation
exports.getAllUtilisateurHydrations = async (req, res) => {
    try {
        const allUtilisateurHydration = await UtilisateurHydration.findAll({
            include: {
                model: HydrationGoal,
                as: 'hydrationGoal', // Assure-toi que l'alias est bien défini dans le modèle
                attributes: ['id', 'name', 'icon', 'description', 'required_glasses'], // Tu peux ajouter d'autres attributs ici
            },
        });
        res.json(allUtilisateurHydration);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une relation utilisateur-objectif d'hydratation
exports.addUtilisateurHydration = async (req, res) => {
    try {
        const { id_utilisateur, id_hydration_goal, firebase_uid } = req.body;

        // Vérifier que les paramètres sont bien définis
        if (!id_utilisateur || !id_hydration_goal || !firebase_uid) {
            return res.status(400).json({ error: 'Tous les champs sont nécessaires' });
        }

        const utilisateur = await Utilisateur.findByPk(id_utilisateur);
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const hydrationGoal = await HydrationGoal.findByPk(id_hydration_goal);
        if (!hydrationGoal) {
            return res.status(404).json({ error: 'Objectif d\'hydratation non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà un objectif actif
        const existingActiveParticipation = await UtilisateurHydration.findOne({
            where: { id_utilisateur, is_active: true },
        });

        if (existingActiveParticipation) {
            return res.status(400).json({ error: 'Vous participez déjà à un programme d\'hydratation.' });
        }

        // Créer la relation utilisateur-hydratation
        const utilisateurHydration = await UtilisateurHydration.create({
            id_utilisateur,
            id_hydration_goal,
            firebase_uid,
            progression: 0.0, // Initialiser la progression
            statut: 'in progress', // Initialiser le statut
            is_active: true, // Marquer comme actif
        });

        res.status(201).json(utilisateurHydration);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer les objectifs d'hydratation d'un utilisateur par son id_utilisateur
exports.getHydrationGoalsByUtilisateur = async (req, res) => {
    try {
        const id_utilisateur = req.params.id_utilisateur;
        const utilisateur = await Utilisateur.findByPk(id_utilisateur);
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        const utilisateurHydrations = await UtilisateurHydration.findAll({
            where: { id_utilisateur, is_active: true }, // Filtrer les objectifs actifs
            include: {
                model: HydrationGoal,
                as: 'hydrationGoal',
                attributes: ['id', 'name', 'icon', 'description', 'required_glasses'],
            },
            attributes: ['id', 'id_utilisateur', 'id_hydration_goal', 'progression', 'statut', 'is_active'],
        });
        res.json(utilisateurHydrations);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer les objectifs d'hydratation d'un utilisateur par son firebase_uid
exports.getHydrationGoalsByFirebaseUid = async (req, res) => {
    try {
        const firebase_uid = req.params.firebase_uid;
        const utilisateur = await Utilisateur.findOne({ where: { firebase_uid } });
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        const utilisateurHydrations = await UtilisateurHydration.findAll({
            where: { firebase_uid, is_active: true }, // Filtrer les objectifs actifs
            include: {
                model: HydrationGoal,
                as: 'hydrationGoal',
                attributes: ['id', 'name', 'icon', 'description', 'required_glasses'],
            },
            attributes: ['id', 'id_utilisateur', 'id_hydration_goal', 'progression', 'statut', 'is_active'],
        });
        res.json(utilisateurHydrations);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer une relation utilisateur-objectif d'hydratation
exports.deleteUtilisateurHydration = async (req, res) => {
    try {
        const { firebase_uid, id_hydration_goal } = req.params;

        console.log("Suppression de l'hydratation pour :", { firebase_uid, id_hydration_goal });

        // Rechercher la relation utilisateur-objectif d'hydratation
        const utilisateurHydration = await UtilisateurHydration.findOne({
            where: { firebase_uid, id_hydration_goal }
        });

        // Vérifier si la relation existe
        if (!utilisateurHydration) {
            return res.status(404).json({ error: "Relation utilisateur-objectif d'hydratation introuvable" });
        }

        // Supprimer la relation
        await utilisateurHydration.destroy();

        // Réponse avec les informations supprimées
        res.json({
            message: "Relation utilisateur-objectif d'hydratation supprimée avec succès",
            deleted: { firebase_uid, id_hydration_goal }
        });

    } catch (err) {
        console.error("Erreur serveur:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Mettre à jour la progression d'une relation utilisateur-objectif d'hydratation
exports.updateProgression = async (req, res) => {
    try {
        const { id_utilisateur, id_hydration_goal, progression } = req.body;

        // Trouver la relation utilisateur-objectif
        const utilisateurHydration = await UtilisateurHydration.findOne({
            where: { id_utilisateur, id_hydration_goal },
        });

        if (!utilisateurHydration) {
            return res.status(404).json({ error: 'Participation non trouvée' });
        }

        // Vérifier si l'objectif est déjà terminé
        if (utilisateurHydration.statut === 'completed') {
            return res.status(400).json({ error: 'L\'objectif est déjà terminé' });
        }

        // Mettre à jour la progression
        utilisateurHydration.progression = progression;

        // Vérifier si l'objectif est atteint
        const hydrationGoal = await HydrationGoal.findByPk(id_hydration_goal);
        if (progression >= hydrationGoal.required_glasses) {
            utilisateurHydration.statut = 'completed';
            utilisateurHydration.is_active = false; // Désactiver l'objectif
        }

        // Sauvegarder les modifications
        await utilisateurHydration.save();

        res.json(utilisateurHydration);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Desactiver une relation utilisateur-objectif d'hydratation
exports.deactivateUtilisateurHydration = async (req, res) => {
    try {
        const { id_utilisateur, id_hydration_goal } = req.body;

        // Trouver la relation utilisateur-objectif
        const utilisateurHydration = await UtilisateurHydration.findOne({
            where: { id_utilisateur, id_hydration_goal },
        });

        if (!utilisateurHydration) {
            return res.status(404).json({ error: 'Participation non trouvée' });
        }

        // Désactiver l'objectif
        utilisateurHydration.is_active = false;
        utilisateurHydration.statut = 'completed'; // Marquer comme terminé

        // Sauvegarder les modifications
        await utilisateurHydration.save();

        res.json(utilisateurHydration);
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};