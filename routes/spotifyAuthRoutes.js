const express = require('express');
const axios = require('axios');
const router = express.Router();
const spotifyAuthController = require('../controllers/spotifyAuth');

// Route pour la connexion à Spotify
router.get('/login', spotifyAuthController.login);

// Route de callback après l'authentification
router.get('/callback', spotifyAuthController.callback);

// Route pour rafraîchir le token avec POST
router.post('/refresh', spotifyAuthController.refreshToken);

// Route pour récupérer l'état du lecteur Spotify
router.get('/player', spotifyAuthController.getPlayerState);

module.exports = router;