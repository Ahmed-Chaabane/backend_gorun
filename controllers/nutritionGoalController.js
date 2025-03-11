const NutritionGoal = require('../models/nutritionGoal');

// Récupérer tous les objectifs nutritionnels
exports.getAllNutritionGoals = async (req, res) => {
    try {
        const nutritionGoals = await NutritionGoal.findAll();
        res.status(200).json(nutritionGoals);
    } catch (err) {
        console.error('Erreur lors de la récupération des objectifs nutritionnels:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un nouvel objectif nutritionnel
exports.addNutritionGoal = async (req, res) => {
    const { name, icon, description, required_meals } = req.body;

    try {
        // Validation des données
        if (!name || !icon || !description || required_meals == null) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const newGoal = await NutritionGoal.create({
            name,
            icon,
            description,
            required_meals,
        });

        return res.status(201).json({
            message: 'Objectif nutritionnel créé avec succès',
            nutritionGoal: newGoal,
        });
    } catch (err) {
        console.error('Erreur lors de la création de l\'objectif nutritionnel:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer un objectif nutritionnel par son ID
exports.getNutritionGoalById = async (req, res) => {
    const { id } = req.params;

    try {
        const nutritionGoal = await NutritionGoal.findByPk(id);

        if (!nutritionGoal) {
            return res.status(404).json({ error: 'Objectif nutritionnel non trouvé' });
        }

        res.status(200).json(nutritionGoal);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'objectif nutritionnel:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un objectif nutritionnel par son ID
exports.updateNutritionGoal = async (req, res) => {
    const { id } = req.params;
    const { name, icon, description, required_meals } = req.body;

    try {
        const nutritionGoal = await NutritionGoal.findByPk(id);

        if (!nutritionGoal) {
            return res.status(404).json({ error: 'Objectif nutritionnel non trouvé' });
        }

        const updatedGoal = await nutritionGoal.update({
            name: name || nutritionGoal.name,
            icon: icon || nutritionGoal.icon,
            description: description || nutritionGoal.description,
            required_meals: required_meals || nutritionGoal.required_meals,
        });

        res.status(200).json({
            message: 'Objectif nutritionnel mis à jour avec succès',
            nutritionGoal: updatedGoal,
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'objectif nutritionnel:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un objectif nutritionnel par son ID
exports.deleteNutritionGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const nutritionGoal = await NutritionGoal.findByPk(id);

        if (!nutritionGoal) {
            return res.status(404).json({ error: 'Objectif nutritionnel non trouvé' });
        }

        await nutritionGoal.destroy();

        res.status(200).json({ message: 'Objectif nutritionnel supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'objectif nutritionnel:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};