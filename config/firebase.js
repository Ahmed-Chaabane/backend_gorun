const admin = require('firebase-admin');

// Remplacez par le chemin de votre fichier JSON
const serviceAccount = require('C:\\Users\\AhmedCHAABANE\\WebstormProjects\\backend_gorun\\config\\gorun-a9277-firebase-adminsdk-pvg4g-064ede5552.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
