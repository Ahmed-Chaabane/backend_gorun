const { body, validationResult } = require('express-validator');
const DefiCommunautaire = require('../models/DefiCommunautaire');

// Obtenir tous les Defis
exports.getAllDefiCommunautaire = async (req, res) => {
    try {
        const defis = await DefiCommunautaire.findAll();
        res.status(200).json(defis);
    } catch (err) {
        console.error('Erreur lors de la récupération des défis :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des défis' });
    }
};

// Ajouter un Defi
exports.addDefiCommunautaire = [
    body('nom_defi').notEmpty().withMessage('Le nom du défi est requis'),
    body('description').notEmpty().withMessage('La description est requise'),
    body('date_debut').isDate().withMessage('La date de début doit être une date valide').custom(value => {
        if (new Date(value) > new Date()) {
            throw new Error('La date de début du défi ne peut pas être dans le futur.');
        }
        return true;
    }),
    body('date_fin').isDate().withMessage('La date de fin doit être une date valide').custom(value => {
        if (new Date(value) > new Date()) {
            throw new Error('La date de fin du défi ne peut pas être dans le futur.');
        }
        return true;
    }),
    body('participants').isInt({ min: 0 }).withMessage('Le nombre de participants doit être un entier positif'),
    body('recompense').optional().isString().withMessage('La récompense doit être une chaîne de caractères'),
    body('icon').optional().isString().withMessage('L\'icône doit être une chaîne de caractères'),
    body('progression').optional().isFloat({ min: 0, max: 1 }).withMessage('La progression doit être un nombre entre 0 et 1'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nom_defi, description, date_debut, date_fin, participants, recompense, icon, progression } = req.body;

        try {
            const newDefi = await DefiCommunautaire.create({
                nom_defi,
                description,
                date_debut,
                date_fin,
                participants,  // Ajout du champ participants
                recompense,
                icon,
                progression,
            });
            res.status(201).json(newDefi);
        } catch (err) {
            console.error('Erreur lors de la création du défi communautaire :', err);
            res.status(500).json({ error: 'Erreur serveur lors de la création du défi communautaire' });
        }
    }
];

// Récupérer un Defi par son ID
exports.getDefiCommunautaireById = async (req, res) => {
    const { id_defi_communautaire } = req.params;

    try {
        const defi = await DefiCommunautaire.findByPk(id_defi_communautaire);
        if (defi) {
            res.status(200).json(defi);
        } else {
            res.status(404).json({ error: 'Défi communautaire non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du défi :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du défi' });
    }
};

// Mettre à jour un Defi
exports.updateDefiCommunautaire = [
    body('nom_defi').optional().notEmpty().withMessage('Le nom du défi ne peut pas être vide'),
    body('description').optional().notEmpty().withMessage('La description ne peut pas être vide'),
    body('date_debut').optional().isDate().withMessage('La date de début doit être une date valide'),
    body('date_fin').optional().isDate().withMessage('La date de fin doit être une date valide'),
    body('participants').optional().isInt({ min: 0 }).withMessage('Le nombre de participants doit être un entier positif'),
    body('recompense').optional().isString().withMessage('La récompense doit être une chaîne de caractères'),
    body('icon').optional().isString().withMessage('L\'icône doit être une chaîne de caractères'),
    body('progression').optional().isFloat({ min: 0, max: 1 }).withMessage('La progression doit être un nombre entre 0 et 1'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id_defi_communautaire } = req.params;
        const { nom_defi, description, date_debut, date_fin, participants, recompense, icon, progression } = req.body;

        try {
            const defi = await DefiCommunautaire.findByPk(id_defi_communautaire);
            if (defi) {
                await defi.update({
                    nom_defi: nom_defi || defi.nom_defi,
                    description: description || defi.description,
                    date_debut: date_debut || defi.date_debut,
                    date_fin: date_fin || defi.date_fin,
                    participants: participants || defi.participants,  // Mise à jour du champ participants
                    recompense: recompense || defi.recompense,
                    icon: icon || defi.icon,
                    progression: progression || defi.progression,
                });
                res.status(200).json(defi);
            } else {
                res.status(404).json({ error: 'Défi communautaire non trouvé' });
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour du défi :', err);
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du défi' });
        }
    }
];

// Supprimer un Defi
exports.deleteDefiCommunautaire = async (req, res) => {
    const { id_defi_communautaire } = req.params;

    try {
        const defi = await DefiCommunautaire.findByPk(id_defi_communautaire);
        if (defi) {
            await defi.destroy();
            res.status(200).json({ message: 'Défi communautaire supprimé avec succès' });
        } else {
            res.status(404).json({ error: 'Défi communautaire non trouvé' });
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du défi :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du défi' });
    }
};
