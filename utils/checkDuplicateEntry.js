const Utilisateur = require('../models/Utilisateur'); // Assurez-vous que le chemin est correct

const checkDuplicateEntry = async (field, value) => {
    if (!value) return; // Ignorer si la valeur n'est pas fournie

    try {
        const existingUser = await Utilisateur.findOne({ where: { [field]: value } });
        if (existingUser) {
            throw new Error(`${field} déjà utilisé`);
        }
    } catch (error) {
        console.error(`Erreur lors de la vérification de duplication (${field}) :`, error.message);
        throw error;
    }
};

module.exports = { checkDuplicateEntry };