const { validationResult } = require('express-validator');
const Utilisateur = require('../models/Utilisateur'); // Importer le modèle Utilisateur

// Obtenir tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.findAll();
        res.json(utilisateurs);
    } catch (err) {
        console.error('Erreur serveur:', err); // Afficher l'erreur pour plus de détails
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un utilisateur
exports.addUtilisateur = async (userData) => {
    try {
        // Création de l'utilisateur sans mot de passe, en incluant firebase_uid
        const nouvelUtilisateur = await Utilisateur.create({
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            telephone: userData.telephone || null,
            taille: userData.taille, // Ajout de la taille
            poids: userData.poids,   // Ajout du poids
            age: userData.age,       // Ajout de l'âge
            date_naissance: userData.date_naissance, // Ajout de la date de naissance
            role: userData.role || 'user', // Définir un rôle par défaut
            statut: 'active', // Par défaut, le statut est 'active'
            firebase_uid: userData.firebase_uid, // Ajout du firebase_uid
            selectedSports: userData.selectedSports || [],
            preferences_sportives: userData.preferences_sportives || [],
            lieux_pratique: userData.lieux_pratique || [],
            frequence_entrainement: typeof userData.frequence_entrainement === 'string' ? userData.frequence_entrainement : null,
            health_conditions: userData.health_conditions || [],
            regime_alimentaire: typeof userData.regime_alimentaire === 'string' ? userData.regime_alimentaire : null,
            objectifs_amelioration: userData.objectifs_amelioration || [],
        });

        if (!nouvelUtilisateur) {
            throw new Error("Échec de la création de l'utilisateur");
        }

        return {
            id_utilisateur: nouvelUtilisateur.id_utilisateur,
            nom: nouvelUtilisateur.nom,
            prenom: nouvelUtilisateur.prenom,
            email: nouvelUtilisateur.email,
            telephone: nouvelUtilisateur.telephone,
            taille: nouvelUtilisateur.taille,
            poids: nouvelUtilisateur.poids,
            age: nouvelUtilisateur.age,
            date_naissance: nouvelUtilisateur.date_naissance,
            statut: nouvelUtilisateur.statut,
            role: nouvelUtilisateur.role, // Ajouter le rôle à la réponse
            firebase_uid: nouvelUtilisateur.firebase_uid, // Retourner firebase_uid
            selectedSports: nouvelUtilisateur.selectedSports, // Retourner selectedSports
            preferences_sportives: nouvelUtilisateur.preferences_sportives,
            lieux_pratique: nouvelUtilisateur.lieux_pratique,
            frequence_entrainement: nouvelUtilisateur.frequence_entrainement,
            health_conditions: nouvelUtilisateur.health_conditions,
            regime_alimentaire: nouvelUtilisateur.regime_alimentaire,
            objectifs_amelioration: nouvelUtilisateur.objectifs_amelioration,
        };
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        throw error;
    }
};

// Obtenir un utilisateur par ID
exports.getUtilisateurById = async (req, res) => {
    const { id_utilisateur } = req.params;
    try {
        const utilisateur = await Utilisateur.findByPk(id_utilisateur);
        if (utilisateur) {
            res.json(utilisateur);
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Obtenir un utilisateur par email
exports.getUtilisateurByEmail = async (req, res) => {
    const { email } = req.params;  // Récupère l'email depuis l'URL
    try {
        const utilisateur = await Utilisateur.findOne({ where: { email } });
        if (utilisateur) {
            res.json(utilisateur);
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
};

// Mettre à jour un utilisateur
exports.updateUtilisateur = async (req, res) => {
    const { firebase_uid } = req.params;
    const {
        nom, prenom, email, taille, poids, age, date_naissance, role, statut, telephone, sexe,
        selectedSports, preferences_sportives, lieux_pratique, frequence_entrainement,
        health_conditions, regime_alimentaire, objectifs_amelioration
    } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ where: { firebase_uid } });
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        if (telephone) {
            const existingUser = await Utilisateur.findOne({ where: { telephone } });
            if (existingUser && existingUser.firebase_uid !== firebase_uid) {
                return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé' });
            }
        }

        await utilisateur.update({
            nom: nom || utilisateur.nom,
            prenom: prenom || utilisateur.prenom,
            email: email || utilisateur.email,
            taille: taille || utilisateur.taille,
            poids: poids || utilisateur.poids,
            age: age || utilisateur.age,
            date_naissance: date_naissance || utilisateur.date_naissance,
            role: role || utilisateur.role,
            statut: statut || utilisateur.statut,
            telephone: telephone || utilisateur.telephone,
            sexe: sexe || utilisateur.sexe,
            selectedSports: Array.isArray(selectedSports) ? selectedSports : utilisateur.selectedSports,
            preferences_sportives: Array.isArray(preferences_sportives) ? preferences_sportives : utilisateur.preferences_sportives,
            lieux_pratique: Array.isArray(lieux_pratique) ? lieux_pratique : utilisateur.lieux_pratique,
            frequence_entrainement: frequence_entrainement || utilisateur.frequence_entrainement,
            health_conditions: Array.isArray(health_conditions) ? health_conditions : utilisateur.health_conditions,
            regime_alimentaire: regime_alimentaire || utilisateur.regime_alimentaire,
            objectifs_amelioration: Array.isArray(objectifs_amelioration) ? objectifs_amelioration : utilisateur.objectifs_amelioration,
        });

        res.json({
            id_utilisateur: utilisateur.id_utilisateur,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            email: utilisateur.email,
            telephone: utilisateur.telephone,
            taille: utilisateur.taille,
            poids: utilisateur.poids,
            age: utilisateur.age,
            date_naissance: utilisateur.date_naissance,
            statut: utilisateur.statut,
            role: utilisateur.role,
            selectedSports: utilisateur.selectedSports,
            preferences_sportives: utilisateur.preferences_sportives,
            lieux_pratique: utilisateur.lieux_pratique,
            frequence_entrainement: utilisateur.frequence_entrainement,
            health_conditions: utilisateur.health_conditions,
            regime_alimentaire: utilisateur.regime_alimentaire,
            objectifs_amelioration: utilisateur.objectifs_amelioration,
        });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err.message });
    }
};

// Supprimer un utilisateur
exports.deleteUtilisateur = async (req, res) => {
    const { id_utilisateur } = req.params;
    try {
        const utilisateur = await Utilisateur.findByPk(id_utilisateur);
        if (utilisateur) {
            await utilisateur.destroy();
            res.json({ message: 'Utilisateur supprimé' });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
