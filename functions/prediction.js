const axios = require('axios');

/**
 * Fonction pour obtenir une prédiction depuis Hugging Face ou un autre modèle ML.
 * @param {string} inputData Les données envoyées pour la prédiction.
 * @returns {Promise<any>} La réponse de l'API.
 */
const getPrediction = async (inputData) => {
    try {
        // Remplacer par l'URL et la clé API de ton modèle
        const API_URL = "https://api-inference.huggingface.co/models/YOUR_MODEL_NAME";
        const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;  // Utiliser la clé API via les variables d'environnement

        const response = await axios.post(
            API_URL,
            { inputs: inputData },
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            }
        );

        return response.data;  // Retourne la réponse du modèle Hugging Face
    } catch (error) {
        console.error("Erreur lors de la prédiction:", error);
        throw new Error('Erreur lors de l\'appel à l\'API de prédiction');
    }
};

module.exports = getPrediction;