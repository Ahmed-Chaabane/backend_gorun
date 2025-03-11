const { body, validationResult } = require('express-validator');
const RecommandationEntrainement = require('../models/RecommandationEntrainement');
const Utilisateur = require('../models/Utilisateur');
const exec = require('child_process').exec; // Assure-toi que cette ligne est présente pour pouvoir utiliser exec

// Obtenir toutes les Recommandations Entrainements
exports.getAllRecommandationEntrainement = async (req, res) => {
    try {
        const recommandations = await RecommandationEntrainement.findAll();
        res.json(recommandations);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une Recommandation d'Entrainement
exports.addRecommandationEntrainement = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { description, id_objectif_sportif, niveau_difficulte, duree_seance, frequence, jours, instructions, exercices, firebase_uid } = req.body;

    try {
        // Vérifier si l'utilisateur existe avec le firebase_uid
        const user = await Utilisateur.findOne({ where: { firebase_uid } });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Créer la recommandation d'entraînement avec les données supplémentaires
        const recommandation = await RecommandationEntrainement.create({
            description,
            id_objectif_sportif,
            niveau_difficulte,
            duree_seance,
            frequence,
            jours,
            instructions,
            exercices,
            id_utilisateur: user.id_utilisateur,  // Association à l'utilisateur
            firebase_uid: user.firebase_uid,  // Association à l'UID Firebase
        });

        res.status(201).json(recommandation);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de la recommandation', details: err.message });
    }
};

// Récupérer une recommandation par son ID
exports.getRecommandationEntrainementById = async (req, res) => {
    const { id_recommandationEntrainement } = req.params;
    try {
        const recommandation = await RecommandationEntrainement.findByPk(id_recommandationEntrainement);
        if (recommandation) {
            res.json(recommandation);
        } else {
            res.status(404).json({ error: 'Recommandation non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour une recommandation
exports.updateRecommandationEntrainement = async (req, res) => {
    const { id_recommandationentrainement } = req.params;
    const { description, id_objectif_sportif, niveau_difficulte, duree_seance, frequence, jours, instructions, exercices } = req.body;
    try {
        const recommandation = await RecommandationEntrainement.findByPk(id_recommandationentrainement);
        if (recommandation) {
            await recommandation.update({
                description,
                id_objectif_sportif,
                niveau_difficulte,
                duree_seance,
                frequence,
                jours,
                instructions,
                exercices,
            });
            res.json(recommandation);
        } else {
            res.status(404).json({ error: 'Recommandation non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer une recommandation
exports.deleteRecommandationEntrainement = async (req, res) => {
    const { id_recommandationEntrainement } = req.params;
    try {
        const recommandation = await RecommandationEntrainement.findByPk(id_recommandationEntrainement);
        if (recommandation) {
            await recommandation.destroy();
            res.json(recommandation);
        } else {
            res.status(404).json({ error: 'Recommandation non trouvée' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Générer et sauvegarder une recommandation en utilisant Hugging Face
exports.generateAndSaveRecommendation = async (req, res) => {
    try {
        const { firebase_uid } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await Utilisateur.findOne({ where: { firebase_uid } });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Construire les données utilisateur
        const userData = {
            firebase_uid: user.firebase_uid,
            taille: user.taille,
            poids: user.poids,
            age: user.age,
            selectedSports: user.selectedSports || [],
            preferences_sportives: user.preferences_sportives || [],
            lieux_pratique: user.lieux_pratique || [],
            frequence_entrainement: user.frequence_entrainement || null,
            health_conditions: user.health_conditions || [],
            regime_alimentaire: user.regime_alimentaire || null,
            objectifs_amelioration: user.objectifs_amelioration || []
        };

        // Convertir les données en JSON et échapper les apostrophes
        const sanitizedData = JSON.stringify(userData);

        // Exécuter le script Python pour générer une recommandation
        exec(`python ai/recommendation.py "${sanitizedData}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur : ${error.message}`);
                return res.status(500).json({ error: "Erreur interne du serveur" });
            }
            if (stderr) {
                console.error(`Stderr : ${stderr}`);
                return res.status(500).json({ error: "Erreur dans le script AI" });
            }

            let recommendation;

            // Essayer de parser la sortie du script Python
            try {
                recommendation = JSON.parse(stdout);
            } catch (parseError) {
                console.error('Erreur de parsing JSON :', parseError);
                return res.status(500).json({ error: "Erreur dans le format de la réponse du script AI" });
            }

            // Vérifier que la recommandation contient les informations nécessaires
            if (!recommendation || !recommendation.recommendation || !recommendation.duree_seance || !recommendation.frequence) {
                return res.status(500).json({ error: "La recommandation générée est incomplète" });
            }

            // Sauvegarder la recommandation dans la base de données
            try {
                const newRecommendation = await RecommandationEntrainement.create({
                    description: recommendation.recommendation,
                    id_objectif_sportif: 1, // Exemple d'objectif sportif, à adapter
                    niveau_difficulte: 2, // Niveau de difficulté, à adapter
                    duree_seance: recommendation.duree_seance,
                    frequence: recommendation.frequence,
                    jours: recommendation.jours || [], // Assurer que les jours sont un tableau
                    instructions: recommendation.instructions || "", // Assurer que les instructions sont valides
                    exercices: recommendation.exercices || [], // Assurer que les exercices sont un tableau valide
                    id_utilisateur: user.id_utilisateur,
                    firebase_uid: user.firebase_uid,
                });

                // Retourner la recommandation
                res.json({
                    firebase_uid: recommendation.firebase_uid,
                    recommendation: newRecommendation,
                });
            } catch (dbError) {
                console.error('Erreur de création dans la base de données :', dbError);
                return res.status(500).json({ error: "Erreur lors de la création de la recommandation" });
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
