const {body, validationResult} = require('express-validator'); //validation de données
const RecommandationEntrainement = require('../models/RecommandationEntrainement'); // Importer le modèle RecommandationEntrainement
const axios = require('axios');

// Obtenir toutes les Recommandations Entrainements
exports.getAllRecommandationEntrainement = async (req, res) => {
    try {
        const recommandations = await RecommandationEntrainement.findAll(); // Récupérer toutes les recommandations
        res.json(recommandations); // Retourner les recommandations au format JSON
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'}); // Si une erreur se produit, renvoyer une erreur 500
    }
};

// Ajouter une Recommandation d'Entrainement
exports.addRecommandationEntrainement = async (req, res) => {

    const errors = validationResult(req); // Récupérer les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); // Retourner les erreurs de validation
    }

    const {description, id_objectif_sportif, niveau_difficulte} = req.body;
    try {
        const recommandation = await RecommandationEntrainement.create({
            description,
            id_objectif_sportif,
            niveau_difficulte
        });
        res.status(201).json(recommandation); // Si l'ajout est réussi, renvoyer la recommandation créé
    } catch (err) {
        console.error('Erreur Sequelize :', err); // Log pour afficher l'erreur complète
        res.status(400).json({error: 'Erreur lors de l’enregistrement de la recommandation', details: err.message}); // Inclure les détails de l'erreur
    }
};

// Récupérer une recommandation par son ID
exports.getRecommandationEntrainementById = async (req, res) => {
    const {id_recommandationEntrainement} = req.params;
    try {
        const recommandation = await RecommandationEntrainement.findByPk(id_recommandationEntrainement); // Chercher la recommandation par ID
        if (recommandation) {
            res.json(recommandation); // Retourner la recommandation
        } else {
            res.status(404).json({error: 'Recommandation non trouvée'}); // Si la recommandation n'est pas trouvée
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Mettre à jour une recommandation
exports.updateRecommandationEntrainement = async (req, res) => {
    const {id_recommandationentrainement} = req.params;
    const {description, id_objectif_sportif, niveau_difficulte} = req.body;
    try {
        const recommandation = await RecommandationEntrainement.findByPk(id_recommandationentrainement);
        if (recommandation) {
            await recommandation.update({
                description,
                id_objectif_sportif,
                niveau_difficulte
            });
            res.json(recommandation);
        } else {
            res.status(404).json({error: 'Recommandation non trouvée'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Supprimer une recommandation
exports.deleteRecommandationEntrainement = async (req, res) => {
    const {id_recommandationEntrainement} = req.params;
    try {
        const recommandation = await RecommandationEntrainement.findByPk(id_recommandationentrainement);
        if (recommandation) {
            await recommandation.destroy();
            res.json(recommandation);
        } else {
            res.status(404).json({error: 'Recommandation non trouvée'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Interagir avec firebase Ml
exports.generateAndSaveRecommandation = async (req, res) => {
    try {
        const userData = req.body; // Récupère les données envoyées (ex: poids, taille, âge, objectifs...)

        // 🔹 Envoie les données à Firebase ML (remplace `YOUR_ML_ENDPOINT` par ton endpoint Firebase ML)
        const response = await axios.post('https://YOUR_ML_ENDPOINT', userData);

        const { description, id_objectif_sportif, niveau_difficulte } = response.data;

        // 🔹 Stocke la recommandation générée dans la BDD
        const newRecommandation = await RecommandationEntrainement.create({
            description,
            id_objectif_sportif,
            niveau_difficulte
        });

        res.status(201).json(newRecommandation); // Retourne la recommandation créée
    } catch (error) {
        console.error("Erreur lors de la génération de la recommandation :", error);
        res.status(500).json({ error: "Erreur lors de la communication avec Firebase ML" });
    }
};