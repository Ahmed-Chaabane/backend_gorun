const {validationResult} = require('express-validator');
const Utilisateur = require('../models/Utilisateur'); // Importer le modèle Utilisateur
const axios = require('axios'); // Ajoute cette ligne !

// Obtenir tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.findAll();
        res.json(utilisateurs);
    } catch (err) {
        console.error('Erreur serveur:', err); // Afficher l'erreur pour plus de détails
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Ajouter un utilisateur
exports.addUtilisateur = async (userData) => {
    try {
        const nouvelUtilisateur = await Utilisateur.create({
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            telephone: userData.telephone || null,
            taille: userData.taille,
            poids: userData.poids,
            age: userData.age,
            date_naissance: userData.date_naissance,
            role: userData.role || 'user',
            statut: 'active',
            firebase_uid: userData.firebase_uid,
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

        // 🔥 **Appel de Flask pour générer la recommandation**
        axios.post('http://127.0.0.1:5000/generate-recommendation', {
            firebase_uid: nouvelUtilisateur.firebase_uid
        }).then(response => {
            console.log("✅ Recommandation envoyée à Flask :", response.data);
        }).catch(error => {
            console.error("❌ Erreur lors de l'appel à Flask :", error.message);
        });

        return nouvelUtilisateur;
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'utilisateur :", error);
        throw error;
    }
};

// Obtenir un utilisateur par ID
exports.getUtilisateurById = async (req, res) => {
    const {id_utilisateur} = req.params;
    try {
        const utilisateur = await Utilisateur.findByPk(id_utilisateur);
        if (utilisateur) {
            res.json(utilisateur);
        } else {
            res.status(404).json({error: 'Utilisateur non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur'});
    }
};

// Obtenir un utilisateur par firebase_uid
exports.getUtilisateurByFirebaseUid = async (req, res) => {
    const { firebase_uid } = req.params; // Utilisez firebase_uid depuis les paramètres de la requête
    try {
        // Rechercher l'utilisateur par firebase_uid
        const utilisateur = await Utilisateur.findOne({
            where: { firebase_uid } // Clause where pour rechercher par firebase_uid
        });

        if (utilisateur) {
            res.json(utilisateur);
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Obtenir un utilisateur par email
exports.getUtilisateurByEmail = async (req, res) => {
    const {email} = req.params;  // Récupère l'email depuis l'URL
    try {
        const utilisateur = await Utilisateur.findOne({where: {email}});
        if (utilisateur) {
            res.json(utilisateur);
        } else {
            res.status(404).json({error: 'Utilisateur non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur serveur', details: err.message});
    }
};

// Mettre à jour un utilisateur
exports.updateUtilisateur = async (req, res) => {
    const {firebase_uid} = req.params;
    const {
        nom, prenom, email, taille, poids, age, date_naissance, role, statut, telephone, sexe,
        selectedSports, preferences_sportives, lieux_pratique, frequence_entrainement,
        health_conditions, regime_alimentaire, objectifs_amelioration
    } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({where: {firebase_uid}});
        if (!utilisateur) {
            return res.status(404).json({error: 'Utilisateur non trouvé'});
        }

        if (telephone) {
            const existingUser = await Utilisateur.findOne({where: {telephone}});
            if (existingUser && existingUser.firebase_uid !== firebase_uid) {
                return res.status(400).json({error: 'Ce numéro de téléphone est déjà utilisé'});
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
        res.status(500).json({error: 'Erreur lors de la mise à jour', details: err.message});
    }
};

// Supprimer un utilisateur
exports.deleteUtilisateur = async (req, res) => {
    const {id_utilisateur} = req.params;
    try {
        const utilisateur = await Utilisateur.findByPk(id_utilisateur);
        if (utilisateur) {
            await utilisateur.destroy();
            res.json({message: 'Utilisateur supprimé'});
        } else {
            res.status(404).json({error: 'Utilisateur non trouvé'});
        }
    } catch (err) {
        res.status(500).json({error: 'Erreur lors de la suppression'});
    }
};

//Recuperer les donnees pour AI
exports.generateRecommendation = async (req, res) => {
    try {
        const {firebase_uid} = req.body;

        // Vérifier si l'utilisateur existe
        const user = await Utilisateur.findOne({where: {firebase_uid}});

        if (!user) {
            return res.status(404).json({error: "Utilisateur non trouvé"});
        }

        // Construire les données complètes
        const userData = {
            firebase_uid: user.firebase_uid, // ✅ Toujours là
            taille: user.taille,
            poids: user.poids,
            age: user.age,
            date_naissance: user.date_naissance,
            selectedSports: user.selectedSports || [],
            preferences_sportives: user.preferences_sportives || [],
            lieux_pratique: user.lieux_pratique || [],
            frequence_entrainement: typeof user.frequence_entrainement === 'string' ? user.frequence_entrainement : null,
            health_conditions: user.health_conditions || [],
            regime_alimentaire: typeof user.regime_alimentaire === 'string' ? user.regime_alimentaire : null,
            objectifs_amelioration: user.objectifs_amelioration || []
        };

        // Exécuter le script Python avec les données utilisateur
        exec(`python3 ai/recommendation.py '${JSON.stringify(userData)}'`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur : ${error.message}`);
                return res.status(500).json({error: "Erreur interne du serveur"});
            }
            if (stderr) {
                console.error(`Stderr : ${stderr}`);
                return res.status(500).json({error: "Erreur dans le script AI"});
            }

            // Retourner la recommandation avec firebase_uid
            const recommendation = JSON.parse(stdout);
            res.json(recommendation);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erreur serveur"});
    }
};