const app = require('./app'); // Importez l'application express
// Importer le fichier des associations
require('./models/associations');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
