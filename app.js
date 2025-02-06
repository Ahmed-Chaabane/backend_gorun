const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const logger = require('./config/logger');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/passport');  // Passport déjà configuré

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
app.use(bodyParser.json());

// 🔹 Configuration des sessions (nécessaire pour Passport)
app.use(session({
    secret: 'votre-secret',  // Remplacez par un secret sécurisé
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,   // Sécurise les cookies
        secure: false,    // Mettre à false en mode local (en production, mettre à true si HTTPS)
        maxAge: 3600000,   // Durée de vie du cookie (1 heure ici)
        cookie: {
            httpOnly: true,
            secure: false, // À mettre à true en production (HTTPS)
            maxAge: 3600000
        }
    }
}));

// 🔹 Initialiser Passport.js
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/DefiProgres', DefiProgresRoutes);
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
        console.log('Authentication réussie, utilisateur:', req.user); // Affiche les détails de l'utilisateur authentifié
        res.redirect('/dashboard');
    }
);

// 🔹 Route de déconnexion
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/dashboard');
    });
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
                url: 'https://your-backend-url.com', // Remplace par l'URL de ton serveur
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
    res.status(500).send("Quelque chose s'est mal passé !");
});

// 🔹 Exporter l'application
module.exports = app;
