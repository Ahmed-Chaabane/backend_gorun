const {body, validationResult} = require('express-validator'); // validation de données
const HabitudeAlimentaire = require('../models/HabitudeAlimentaire'); // Importer le modèle HabitudeAlimentaire

// Obtenir tous les Alimentaires
exports.getAllHabitudeAlimentairesController = async (req, res) => {
    try {
        const alimentaires = await HabitudeAlimentaire.findAll(); // Récupérer toutes les Alimentaires
        res.json(alimentaires); // Retourner les participants au format JSON
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' }); // Si une erreur se produit, renvoyer une erreur 500
    }
};

// Ajouter un Alimentaire
exports.addHabitudeAlimentaire =async(req,res) => {

    const errors = validationResult(req); // Récupérer les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); // Retourner les erreurs de validation
    }

    const{type_aliment,quantite,date_habitude_alimentaire,id_utilisateur,id_aliment}= req.body;
    try{
        const alimentaire = await HabitudeAlimentaire.create({
            type_aliment,
            quantite,
            date_habitude_alimentaire,
            id_utilisateur,
            id_aliment
        });
        res.status(201).json(alimentaire); // Si l'ajout est réussi, renvoyer l'alimentaire créé
    } catch (err) {
        console.error('Erreur Sequelize :', err); // Log pour afficher l'erreur complète
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de l\'alimentaire', details: err.message }); // Inclure les détails de l'erreur
    }
};

// Récupérer un alimentaire par son ID
exports.getHabitudeAlimentaireById = async (req,res)=>{
    const {id_habitude_alimentaire} = req.params;
    try{
        const alimentaire = await HabitudeAlimentaire.findByPk(id_habitude_alimentaire); // Chercher l'alimentaire par ID
        if (alimentaire) {
            res.json(alimentaire); // Retourner l'alimentaire
        } else {
            res.status(404).json({ error: 'Alimentaire non trouvé' }); // Si l'alimentaire n'est pas trouvé
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un alimentaire
exports.updateHabitudeAliment = async(req,res)=>{
   const {id_habitude_alimentaire} = req.params;
   const {type_aliment,quantite,date_habitude_alimentaire,id_utilisateur,id_aliment}= req.body;
    try {
        const alimentaire = await HabitudeAlimentaire.findByPk(id_habitude_alimentaire);
        if (alimentaire) {
            await alimentaire.update({
                type_aliment,
                quantite,
                date_habitude_alimentaire,
                id_utilisateur,
                id_aliment
            });
            res.json(alimentaire);
        } else {
            res.status(404).json({error: 'Alimentaire non trouvé'});
        }

    }catch (err){
        res.status(500).json({error: 'Erreur lors de la mise à jour de l\'alimentaire'});
    }
};

// Supprimer un alimentaire
exports.deleteHabitudeAlimentaire = async (req, res) => {
    const {id_habitude_alimentaire} = req.params;
    try {
        const alimentaire = await HabitudeAlimentaire.findByPk(id_habitude_alimentaire);
        if (alimentaire) {
            await alimentaire.destroy(); // Supprimer l'alimentaire
            res.json({message: 'Alimentaire supprimé'});
        } else {
            res.status(404).json({error: 'Alimentaire non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de la suppression'});
    }
};