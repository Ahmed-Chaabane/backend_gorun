const axios = require('axios');

// URL de votre modèle Hugging Face
const API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1";
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN; // Assurez-vous que cette variable d'environnement est configurée

/**
 * Fonction pour obtenir une prédiction depuis Hugging Face.
 * @param {Object} inputData Les données envoyées à Hugging Face pour la prédiction.
 * @returns {Promise<any>} La réponse de Hugging Face.
 */
const getHuggingFacePrediction = async (inputData) => {
    try {
        const response = await axios.post(
            API_URL,
            { inputs: inputData },  // Structure des données selon les besoins du modèle
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            }
        );
        return response.data;  // Retourne la réponse du modèle Hugging Face
    } catch (error) {
        console.error("Erreur Hugging Face:", error);
        throw new Error('Erreur lors de l\'appel au modèle Hugging Face');
    }
};

module.exports = getHuggingFacePrediction;
