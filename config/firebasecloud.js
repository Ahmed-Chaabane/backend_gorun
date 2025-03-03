const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.predict = functions.https.onRequest(async (req, res) => {
    try {
        // Récupérer les données envoyées par le frontend Flutter
        const { poids, taille, age, objectif } = req.body;

        // Logique pour interagir avec Firebase ML ou un autre modèle d'IA
        const prediction = await getMLPrediction(poids, taille, age, objectif);

        // Renvoyer la réponse de prédiction
        res.status(200).send({ prediction });
    } catch (error) {
        res.status(500).send({ error: 'Erreur lors de la prédiction' });
    }
});
