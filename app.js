require('dotenv').config(); // Charger les variables d'environnement

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const logger = require('./config/logger');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/passport'); // Configuration de Passport.js


const app = express();

// 🔹 Sécuriser les en-têtes HTTP
app.use(helmet());

// 🔹 Middleware de log avec morgan + Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// 🔹 Middleware de parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Configuration des sessions (nécessaire pour Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',  // Remplace par un secret sécurisé
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,   // Sécurise les cookies
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        maxAge: 3600000   // Durée de vie du cookie (1 heure)
    }
}));

// 🔹 Initialiser Passport.js
app.use(passport.initialize());
app.use(passport.session());

// cors pour autoriser les requêtes de n'importe quelle origine
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes


// 🔹 Vérifier que les variables d'environnement sont bien chargées
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "OK" : "NON DÉFINI");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "OK" : "NON DÉFINI");
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL ? "OK" : "NON DÉFINI");

// 🔹 Import des routes
const ActiviteSportiveRoutes = require('./routes/ActiviteSportiveRoutes');
const AlimentsRoutes = require('./routes/AlimentsRoutes');
const DefiCommunautaireRoutes = require('./routes/DefiCommunautaireRoutes');
const DefiParticipantsRoutes = require('./routes/DefiParticipantsRoutes');
const DefiProgresRoutes = require('./routes/DefiProgresRoutes');
const DetailActiviteSportiveRoutes = require('./routes/DetailActiviteSportiveRoutes');
const EvenementRoutes = require('./routes/EvenementRoutes');
const HabitudeAlimentaireRoutes = require('./routes/HabitudeAlimentaireRoutes');
const InteractionsRoutes = require('./routes/InteractionsRoutes');
const ObjectifSportifRoutes = require('./routes/ObjectifSportifRoutes');
const ProgressionObjectifRoutes = require('./routes/ProgressionObjectifRoutes');
const RecommandationEntrainementRoutes = require('./routes/RecommandationEntrainementRoutes');
const RecommandationRecuperationRoutes = require('./routes/RecommandationRecuperationRoutes');
const RecuperationBlessureRoutes = require('./routes/RecuperationBlessureRoutes');
const UtilisateurRoutes = require('./routes/UtilisateurRoutes');

// 🔹 Routes API
app.use('/api/activitesportive', ActiviteSportiveRoutes);
app.use('/api/aliments', AlimentsRoutes);
app.use('/api/deficommunautaire', DefiCommunautaireRoutes);
app.use('/api/defiparticipants', DefiParticipantsRoutes);
app.use('/api/defiprogres', DefiProgresRoutes);
app.use('/api/detailactivitesportive', DetailActiviteSportiveRoutes);
app.use('/api/evenement', EvenementRoutes);
app.use('/api/habitudealimentaire', HabitudeAlimentaireRoutes);
app.use('/api/interactions', InteractionsRoutes);
app.use('/api/objectifsportif', ObjectifSportifRoutes);
app.use('/api/progressionobjectif', ProgressionObjectifRoutes);
app.use('/api/recommandationentrainement', RecommandationEntrainementRoutes);
app.use('/api/recommandationrecuperation', RecommandationRecuperationRoutes);
app.use('/api/recuperationblessure', RecuperationBlessureRoutes);
app.use('/api/utilisateur', UtilisateurRoutes);

// 🔹 Routes d'authentification Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // L'utilisateur est authentifié, il est stocké dans la session.
        console.log('Utilisateur authentifié:', req.user);
        res.redirect('/dashboard');  // Rediriger vers le tableau de bord
    }
);

// 🔹 Route de déconnexion
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/dashboard');
    });
});

// 🔹 Route pour afficher le tableau de bord
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        // L'utilisateur est authentifié, affiche le tableau de bord
        res.send('<h1>Bienvenue dans votre tableau de bord, ' + req.user.nom + ' ' + req.user.prenom + '!</h1>');
    } else {
        // L'utilisateur n'est pas authentifié, rediriger vers la page de login
        res.redirect('/auth/google');
    }
});

// 🔹 Configuration de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'APIs GoRun',
            version: '1.0.0',
            description: 'Documentation de l\'APIs GoRun',
        },
        servers: [
            {
                url: process.env.API_BASE_URL || 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

// 🔹 Génération et configuration Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔹 Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: 'Données invalides', details: err.errors });
    } else if (err.name === 'CastError') {
        res.status(400).json({ message: 'Identifiant invalide', details: err.message });
    } else {
        res.status(500).send("Quelque chose s'est mal passé !");
    }
});

// 🔹 Exporter l'application
module.exports = app;
