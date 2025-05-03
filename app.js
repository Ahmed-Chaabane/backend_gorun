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
const axios = require('axios');

require('./models/associations');

const app = express();

// 🔹 Middleware de sécurité (Helmet)
app.use(helmet());

// 🔹 Middleware de parsing JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Middleware CORS pour autoriser les requêtes de n'importe quelle origine
const cors = require('cors');
app.use(cors());

// 🔹 Middleware de gestion des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret', // Remplacez par un secret sécurisé
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Sécurise les cookies
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        maxAge: 3600000 // Durée de vie du cookie (1 heure)
    }
}));

// 🔹 Middleware de logging avec Morgan + Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// 🔹 Initialisation de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// 🔹 Vérification des variables d'environnement
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "OK" : "NON DÉFINI");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "OK" : "NON DÉFINI");
console.log("SPOTIFY_CLIENT_ID:", process.env.SPOTIFY_CLIENT_ID ? "OK" : "NON DÉFINI");
console.log("SPOTIFY_CLIENT_SECRET:", process.env.SPOTIFY_CLIENT_SECRET ? "OK" : "NON DÉFINI");

// 🔹 Import des routes API
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
const HydrationGoalRoutes = require('./routes/HydrationGoalRoutes');
const utilisateurHydrationRoutes = require('./routes/UtilisateurHydrationRoutes');
const NutritionGoalRoutes = require('./routes/NutritionGoalRoutes');
const sleepGoalRoutes = require('./routes/sleepGoalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const UtilisateurObjectifRoutes = require('./routes/UtilisateurObjectifRoutes');
const spotifyAuth = require('./routes/spotifyAuth');
const spotifyAuthRoutes = require('./routes/spotifyAuthRoutes');
const spotifyUserRoutes = require('./routes/spotifyUserRoutes');
const benefitRoutes = require('./routes/BenefitsRoutes'); // Importer les routes Benefits

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
app.use('/api/hydrationgoal', HydrationGoalRoutes);
app.use('/api/utilisateurhydration', utilisateurHydrationRoutes);
app.use('/api/nutritiongoal', NutritionGoalRoutes);
app.use('/api/sleepgoals', sleepGoalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/utilisateur-objectif', UtilisateurObjectifRoutes);
app.use('/api/spotify/auth', spotifyAuth); // Route d'authentification Spotify
app.use('/api/spotify/user', spotifyUserRoutes); // Routes utilisateur Spotify
app.use('/api/spotify', spotifyAuthRoutes); // Autres routes Spotify
app.use('/api/benefits', benefitRoutes); // Routes Benefits

// 🔹 Route pour le tableau de bord Spotify
app.get('/api/dashboard', async (req, res) => {
    if (!req.session.spotifyUser) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const { access_token } = req.session.spotifyUser;

    try {
        // Récupérer les playlists de l'utilisateur
        const playlistsResponse = await axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        // Récupérer l'état du lecteur (piste en cours)
        let playerState = null;
        try {
            const playerResponse = await axios.get("https://api.spotify.com/v1/me/player", {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            playerState = playerResponse.data;
        } catch (playerError) {
            console.error("Erreur lors de la récupération de l'état du lecteur :", playerError.response?.data || playerError.message);
        }

        // Retourner les données au frontend
        res.json({
            user: req.session.spotifyUser.profile,
            playlists: playlistsResponse.data.items,
            currentTrack: playerState?.item?.name || "Aucune piste en cours"
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données Spotify :", error.response?.data || error.message);
        res.status(500).json({ error: "Impossible de récupérer les données Spotify" });
    }
});

// 🔹 Routes d'authentification Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // L'utilisateur est authentifié, il est stocké dans la session.
        console.log('Utilisateur authentifié:', req.user);
        res.redirect('/dashboard'); // Rediriger vers le tableau de bord
    }
);

// 🔹 Route de déconnexion
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// 🔹 Route pour afficher le tableau de bord
app.get('/dashboard', (req, res) => {
    res.redirect('/api/dashboard'); // Redirige vers l'API JSON
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