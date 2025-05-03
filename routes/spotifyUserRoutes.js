const express = require('express');
const router = express.Router();
const spotifyUserController = require('../controllers/spotifyUser');

// Route pour récupérer les infos de l'utilisateur Spotify
router.get('/me', spotifyUserController.getUserProfile);

// Route pour récupérer les playlists de l'utilisateur Spotify
router.get('/playlists', spotifyUserController.getUserPlaylists);

// Route pour récupérer l'état du lecteur Spotify
router.get('/player-state', spotifyUserController.getPlayerState);

module.exports = router;
