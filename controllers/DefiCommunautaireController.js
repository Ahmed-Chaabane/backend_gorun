const {body, validationResult} = require('express-validator'); //validation de données
const DefiCommunautaire = require('../models/DefiCommunautaire'); // Importer le modèle DefiCommunautaire


// Obtenir tous les Defis
exports.getAllDefiCommunautaire = async (req, res) => {
    try {
        const defis = await DefiCommunautaire.findAll(); // Récupérer toutes les Defis
        res.json(defis); // Retourner les defis au format JSON
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'}); // Si une erreur se produit, renvoyer une erreur 500
    }
};

// Ajouter un Defi
exports.addDefiCommunautaire = async (req, res) => {

    const errors = validationResult(req); // Récupérer les erreurs de validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); // Retourner les erreurs de validation
    }

    const {id_defi_communautaire, nom_defi, description, date_debut, date_fin, objectif, id_utilisateur} = req.body;
    try {
        const deficommunautaire = await DefiCommunautaire.create({
            id_defi_communautaire,
            nom_defi,
            description,
            date_debut,
            date_fin,
            objectif,
            id_utilisateur
        })
        res.status(201).json(deficommunautaire);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({error: 'Erreur lors de l’enregistrement du défi communautaire', details: err.message});
    }
};

// Récupérer un Defi par son ID
exports.getDefiCommunautaireById = async (req, res) => {
    const {id_defi_communautaire} = req.params;
    try {
        const deficommunautaire = await DefiCommunautaire.findByPk(id_defi_communautaire);
        if (deficommunautaire) {
            res.json(deficommunautaire);
        } else {
            res.status(404).json({error: 'Défi communautaire non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur lors de la récupération du défi communautaire'});
    }
};
// Mettre à jour un Defi
exports.updateDefiCommunautaire = async (req, res) => {
    const {id_defi_communautaire} = req.params;
    const {nom_defi, description, date_debut, date_fin, objectif, id_utilisateur} = req.body;
    try {
        const deficommunautaire = await DefiCommunautaire.findByPk(id_defi_communautaire);
        if (deficommunautaire) {
            await deficommunautaire.update({
                nom_defi,
                description,
                date_debut,
                date_fin,
                objectif,
                id_utilisateur
            });
            res.json(deficommunautaire);
        } else {
            res.status(404).json({error: 'Défi communautaire non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de la mise à jour du défi communautaire'});
    }
};

// Supprimer un Defi
exports.deleteDefiCommunautaire = async (req, res) => {
    const {id_defi_communautaire} = req.params;
    try {
        const deficommunautaire = await DefiCommunautaire.findByPk(id_defi_communautaire);
        if (deficommunautaire) {
            await deficommunautaire.destroy();
            res.json({message: 'Défi communautaire supprimé'});
        } else {
            res.status(404).json({error: 'Défi communautaire non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de la suppression du défi communautaire'});
    }
};