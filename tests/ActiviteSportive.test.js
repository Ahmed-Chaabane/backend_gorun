const request = require('supertest');
const app = require('../app'); // Importer l'application Express
const sequelize = require('../config/database'); // Importez votre fichier de configuration Sequelize

// S'assurer que la connexion est authentifiée avant d'exécuter les tests
beforeAll(async () => {
    await sequelize.authenticate(); // Ensure that the connection is authenticated before running tests
});

// Fermer la connexion à la base de données après les tests
afterAll(async () => {
    await sequelize.close();
});

describe('Tests des routes ActiviteSportive', () => {
    // Test de la route GET
    it('GET /api/activitesportive doit retourner un statut 200', async () => {
        const response = await request(app).get('/api/activitesportive');
        expect(response.status).toBe(200); // Vérifie que le statut est 200
    });

    // Test de la route POST avec données invalides
    it('POST /api/activitesportive avec données invalides doit retourner un statut 400', async () => {
        const response = await request(app)
            .post('/api/activitesportive')
            .send({}); // Données vides ou invalides
        expect(response.status).toBe(400); // Vérifie que c'est une erreur de validation
    });

    // Vous pouvez ajouter d'autres tests ici, comme un test POST avec des données valides
});
