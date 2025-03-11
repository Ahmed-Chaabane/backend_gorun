const HydrationGoal = require('../models/HydrationGoal');

// Récupérer tous les objectifs d'hydratation
exports.getAllHydrationGoals = async (req, res) => {
    try {
        const hydrationGoals = await HydrationGoal.findAll();
        res.status(200).json(hydrationGoals);
    } catch (err) {
        console.error('Erreur lors de la récupération des objectifs d\'hydratation:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un nouvel objectif d'hydratation
exports.addHydrationGoal = async (req, res) => {
    const { name, icon, description, required_glasses } = req.body;

    try {
        // Validation des données
        if (!name || !icon || !description || required_glasses == null) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const newGoal = await HydrationGoal.create({
            name,
            icon,
            description,
            required_glasses
        });

        return res.status(201).json({
            message: 'Objectif d\'hydratation créé avec succès',
            hydrationGoal: newGoal,
        });
    } catch (err) {
        console.error('Erreur lors de la création de l\'objectif d\'hydratation:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer un objectif d'hydratation par son ID
exports.getHydrationGoalById = async (req, res) => {
    const { id } = req.params;

    try {
        const hydrationGoal = await HydrationGoal.findByPk(id);

        if (!hydrationGoal) {
            return res.status(404).json({ error: 'Objectif d\'hydratation non trouvé' });
        }

        res.status(200).json(hydrationGoal);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'objectif d\'hydratation:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un objectif d'hydratation par son ID
exports.updateHydrationGoal = async (req, res) => {
    const { id } = req.params;
    const { name, icon, description, required_glasses } = req.body;

    try {
        const hydrationGoal = await HydrationGoal.findByPk(id);

        if (!hydrationGoal) {
            return res.status(404).json({ error: 'Objectif d\'hydratation non trouvé' });
        }

        const updatedGoal = await hydrationGoal.update({
            name: name || hydrationGoal.name,
            icon: icon || hydrationGoal.icon,
            description: description || hydrationGoal.description,
            required_glasses: required_glasses || hydrationGoal.required_glasses,
        });

        res.status(200).json({
            message: 'Objectif d\'hydratation mis à jour avec succès',
            hydrationGoal: updatedGoal,
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'objectif d\'hydratation:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un objectif d'hydratation par son ID
exports.deleteHydrationGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const hydrationGoal = await HydrationGoal.findByPk(id);

        if (!hydrationGoal) {
            return res.status(404).json({ error: 'Objectif d\'hydratation non trouvé' });
        }

        await hydrationGoal.destroy();

        res.status(200).json({ message: 'Objectif d\'hydratation supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'objectif d\'hydratation:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
