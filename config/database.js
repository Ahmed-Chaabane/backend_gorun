const { Sequelize } = require('sequelize');
require('dotenv').config();

// Vérification des variables d'environnement
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Erreur : La variable d'environnement ${envVar} est manquante.`);
        process.exit(1);  // Arrête l'application si une variable d'environnement est manquante
    }
}

// Configurer un pool de connexions pour la gestion des performances
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,  // Désactiver les logs SQL
        retry: {
            max: 3,  // Nombre maximum de tentatives de reconnexion
            backoffBase: 100,  // Temps de pause entre les tentatives
            backoffExponent: 1.5
        },
        pool: {
            max: 5,  // Nombre maximum de connexions dans le pool
            min: 0,   // Nombre minimum de connexions dans le pool
            acquire: 30000, // Temps (en ms) avant de considérer une connexion comme échouée
            idle: 10000  // Temps d'inactivité avant de libérer une connexion
        },
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {},
    }
);

// Fonction asynchrone pour gérer la connexion
const connectToDatabase = async () => {
    try {
        console.log('Tentative de connexion à la base de données PostgreSQL...');
        await sequelize.authenticate();
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connecté à la base de données PostgreSQL');
        }
    } catch (err) {
        if (err.name === 'SequelizeConnectionRefusedError') {
            console.error('Erreur : Connexion refusée à PostgreSQL. Veuillez vérifier les informations de connexion.');
        } else {
            console.error('Erreur de connexion à PostgreSQL :', err.message);
        }
        process.exit(1);  // Arrête l'application si la connexion échoue
    }
};

// Appeler la fonction pour se connecter à la base de données
connectToDatabase();

// Fonction pour surveiller périodiquement l'état de la connexion (par exemple, chaque 10 minutes)
setInterval(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données vérifiée avec succès.');
    } catch (err) {
        console.error('Erreur de connexion à la base de données pendant la vérification périodique :', err.message);
    }
}, 600000);  // 10 minutes en ms

module.exports = sequelize;
