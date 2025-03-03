const {body, validationResult} =require('express-validator');
const Defiprogres = require('../models/DefiProgres');

// Obtenir tous les progres dans chaque defi triés par ID de defi
exports.getAllDefiProgres = async(req,res) =>{
    try{
        const progres = await Defiprogres.findAll({
            order: [['id_defi', 'ASC']]
        });
        res.json(progres);
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Ajouter un progres
exports.addDefiProgres = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id_utilisateur, progres, date } = req.body;
    try {
        const newProgres = await Defiprogres.create({
            id_utilisateur,
            progres,
            date
        });
        res.status(201).json(newProgres);
    } catch (err) {
        console.error('Erreur Sequelize :', err);
        res.status(400).json({ error: 'Erreur lors de l’enregistrement de progres', details: err.message });
    }
};

// Récupérer les progres dans le defi par ID defi
exports.getDefiProgresById = async(req, res) => {
    const {id_defi} = req.params;
    try {
        const defiprogress = await Defiprogres.findAll({
            where: {id_defi},
        });
        if (defiprogress.length > 0) {
            res.json(defiprogress);
        } else {
            res.status(404).json({error: 'pas de progres dans ce defi'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Mettre à jour un progres par ID
exports.updateDefiProgres = async(req, res) => {
    const {id_progres} = req.params;
    const {id_utilisateur, progres, date} = req.body;
    try {
        const progres = await Defiprogres.findByPk(id_progres);
        if (progres) {
            await progres.update({
                id_utilisateur,
                progres,
                date
            });
            res.json(progres);
        } else {
            res.status(404).json({error: 'Progres non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Supprimer un progres par ID
exports.deleteDefiProgres = async(req,res) =>{
    const {id_progres} = req.params;
    try{
        const progres = await Defiprogres.findByPk(id_progres);
        if (progres) {
            await progres.destroy();
            res.json({message: 'Progres supprimé'});
        } else {
            res.status(404).json({error: 'Progres non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};