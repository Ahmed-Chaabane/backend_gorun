const HydrationGoal = require('../models/sleepGoal');

// controllers/sleepGoalController.js
const SleepGoal = require('../models/SleepGoal');

// Récupérer tous les objectifs de sommeil
exports.getAllSleepGoals = async (req, res) => {
    try {
        const sleepGoals = await SleepGoal.findAll();
        res.status(200).json(sleepGoals);
    } catch (error) {
        console.error('Erreur lors de la récupération des objectifs de sommeil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Créer un nouvel objectif de sommeil
exports.createSleepGoal = async (req, res) => {
    const { name, icon, description, required_hours, quality_goal, sport_type } = req.body;
    try {
        const newGoal = await SleepGoal.create({
            name,
            icon,
            description,
            required_hours,
            quality_goal,
            sport_type,
        });
        res.status(201).json(newGoal);
    } catch (error) {
        console.error('Erreur lors de la création de l\'objectif de sommeil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un objectif de sommeil
exports.deleteSleepGoal = async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await SleepGoal.findByPk(id);
        if (!goal) {
            return res.status(404).json({ error: 'Objectif de sommeil non trouvé' });
        }
        await goal.destroy();
        res.status(200).json({ message: 'Objectif supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'objectif de sommeil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Update a sleep goal by ID
exports.updateSleepGoal = async (req, res) => {
    const { id } = req.params;
    const { name, icon, description, required_hours, quality_goal, sport_type } = req.body;
    try {
        const goal = await SleepGoal.findByPk(id);
        if (!goal) {
            return res.status(404).json({ error: 'Objectif de sommeil non trouvé' });
        }
        await goal.update({
            name,
            icon,
            description,
            required_hours,
            quality_goal,
            sport_type,
        });
        res.status(200).json(goal);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'objectif de sommeil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Récupérer un objectif de sommeil par ID
exports.getSleepGoalById = async (req, res) => {
    const { id } = req.params;
    try {
        const goal = await SleepGoal.findByPk(id);
        if (!goal) {
            return res.status(404).json({ error: 'Objectif de sommeil non trouvé' });
        }
        res.status(200).json(goal);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif de sommeil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};