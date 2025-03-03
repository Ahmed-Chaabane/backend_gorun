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

describe('Tests des routes ProgressionObjectif', () => {
    it('GET /api/progressionobjectif doit retourner un statut 200', async () => {
        const response = await request(app).get('/api/progressionobjectif');
        expect(response.status).toBe(200); // Vérifie que le statut est 200
    });

    it('POST /api/progressionobjectif avec données invalides doit retourner un statut 400', async () => {
        const response = await request(app)
            .post('/api/progressionobjectif')
            .send({}); // Données vides ou invalides
        expect(response.status).toBe(400); // Vérifie que c'est une erreur
    });
});