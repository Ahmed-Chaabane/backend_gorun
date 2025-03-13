const { body, validationResult } = require('express-validator');
const UtilisateurObjectif = require('../models/UtilisateurObjectif');
const ObjectifSportif = require('../models/ObjectifSportif');
const Utilisateur = require('../models/Utilisateur');

// Obtenir tous les liens utilisateur-objectif avec les détails de l'objectif sportif
exports.getAllUtilisateurObjectifs = async (req, res) => {
    try {
        const liens = await UtilisateurObjectif.findAll({
            include: [
                {
                    model: ObjectifSportif,
                    as: 'objectif_sportif',
                    attributes: ['name', 'description'], // ✅ Utilisez `name` au lieu de `nom`
                },
            ],
        });
        res.json(liens);
    } catch (err) {
        console.error('Erreur lors de la récupération des liens :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un lien utilisateur-objectif
exports.addUtilisateurObjectif = async (req, res) => {
    console.log(req.body);  // Affiche les données reçues pour déboguer

    const { id_objectif_sportif, firebase_uid, date_debut, date_fin, id_utilisateur, etat } = req.body;

    if (!id_objectif_sportif || !firebase_uid || !date_debut || !date_fin) {
        return res.status(400).json({
            error: 'Tous les champs sont requis : id_objectif_sportif, firebase_uid, date_debut, date_fin'
        });
    }

    try {
        const newObjectif = await UtilisateurObjectif.create({
            id_objectif_sportif,
            firebase_uid,
            date_debut,
            date_fin,
            id_utilisateur,
            etat
        });

        return res.status(201).json({
            message: 'Objectif ajouté avec succès',
            objectif: newObjectif
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'objectif:', error);
        return res.status(500).json({
            error: 'Erreur lors de l\'ajout de l\'objectif',
            details: error.message
        });
    }
};

// Récupérer un lien utilisateur-objectif par ID
exports.getUtilisateurObjectifById = async (req, res) => {
    const { id_utilisateur_objectif } = req.params;
    try {
        const lien = await UtilisateurObjectif.findByPk(id_utilisateur_objectif, {
            include: [{ model: ObjectifSportif, as: 'objectif_sportif' }],
        });

        if (lien) {
            res.json(lien);
        } else {
            res.status(404).json({ error: 'Lien utilisateur-objectif non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la recherche du lien :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mettre à jour un lien utilisateur-objectif
exports.updateUtilisateurObjectif = [
    body('id_objectif_sportif').optional().isInt().withMessage("L'ID de l'objectif sportif doit être un entier valide."),
    body('date_debut').optional().isISO8601().withMessage("La date de début doit être au format ISO 8601 (YYYY-MM-DD)."),
    body('date_fin')
        .optional()
        .isISO8601()
        .withMessage("La date de fin doit être au format ISO 8601 (YYYY-MM-DD).")
        .custom((value, { req }) => {
            if (req.body.date_debut && new Date(value) <= new Date(req.body.date_debut)) {
                throw new Error("La date de fin doit être postérieure à la date de début.");
            }
            return true;
        }),
    body('firebase_uid').optional().isString().withMessage("Le Firebase UID de l'utilisateur est requis."),
    body('etat').optional().notEmpty().withMessage("L'état est obligatoire si fourni."),

    async (req, res) => {
        const { id_utilisateur_objectif } = req.params;
        const { id_objectif_sportif, date_debut, date_fin, firebase_uid, etat } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const lien = await UtilisateurObjectif.findByPk(id_utilisateur_objectif);
            if (!lien) {
                return res.status(404).json({ error: 'Lien utilisateur-objectif non trouvé' });
            }

            // Mettre à jour avec firebase_uid
            await lien.update({ id_objectif_sportif, date_debut, date_fin, firebase_uid, etat });

            res.json(lien);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du lien :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },
];

// Supprimer un lien utilisateur-objectif
exports.deleteUtilisateurObjectif = async (req, res) => {
    const { id_utilisateur_objectif } = req.params;
    try {
        const lien = await UtilisateurObjectif.findByPk(id_utilisateur_objectif);
        if (!lien) {
            return res.status(404).json({ error: 'Lien utilisateur-objectif non trouvé' });
        }

        await lien.destroy();
        res.json({ message: 'Lien utilisateur-objectif supprimé avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression du lien :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
