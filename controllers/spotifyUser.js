const axios = require('axios');

// Fonction pour récupérer le profil de l'utilisateur
exports.getUserProfile = async (req, res) => {
    let accessToken = req.session.spotifyAccessToken;

    if (!accessToken) {
        console.error("❌ Aucun token d'accès trouvé dans la session !");
        return res.status(401).json({ error: 'Utilisateur non authentifié (Token manquant)' });
    }

    try {
        console.log("🔎 Token d'accès utilisé :", accessToken);

        // Requête vers l'API Spotify
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return res.json(response.data);

    } catch (error) {
        // Si le token est expiré, on tente de le rafraîchir
        if (error.response?.status === 401) {
            console.log('🔄 Token expiré, tentative de rafraîchissement...');

            const refreshToken = req.session.spotifyRefreshToken;
            if (!refreshToken) {
                console.error("❌ Aucun refresh token trouvé !");
                return res.status(401).json({ error: 'Refresh token manquant' });
            }

            try {
                // Appelle l'API locale pour rafraîchir le token (utilise POST ici)
                const refreshResponse = await axios.post('http://localhost:3000/api/spotify/refresh', {
                    refresh_token: refreshToken  // Envoie le refresh token dans le corps de la requête
                });

                if (!refreshResponse.data.access_token) {
                    console.error("❌ Échec du rafraîchissement du token !");
                    return res.status(500).json({ error: "Échec du rafraîchissement du token" });
                }

                const newAccessToken = refreshResponse.data.access_token;
                req.session.spotifyAccessToken = newAccessToken;

                console.log("✅ Nouveau token d'accès récupéré :", newAccessToken);

                // Refaire la requête avec le nouveau token
                const retryResponse = await axios.get('https://api.spotify.com/v1/me', {
                    headers: { Authorization: `Bearer ${newAccessToken}` }
                });

                return res.json(retryResponse.data);

            } catch (refreshError) {
                console.error("❌ Erreur lors du rafraîchissement :", refreshError.response?.data || refreshError.message);
                return res.status(500).json({ error: "Erreur lors du rafraîchissement du token Spotify" });
            }
        }

        // Si l'erreur n'est pas un problème de token expiré
        console.error('❌ Erreur API Spotify:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Impossible de récupérer les données utilisateur', details: error.response?.data || error.message });
    }
};

// Fonction pour récupérer les playlists de l'utilisateur
exports.getUserPlaylists = async (req, res) => {
    let accessToken = req.session.spotifyAccessToken;
    if (!accessToken) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    try {
        // Vérification si le jeton d'accès est valide en récupérant les infos de l'utilisateur
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Utilisateur connecté:', userResponse.data);  // Log de l'utilisateur

        // Requête vers l'API Spotify pour récupérer les playlists de l'utilisateur
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return res.json(response.data.items); // Retourne la liste des playlists
    } catch (error) {
        console.error("Erreur API Spotify:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Erreur de récupération des playlists" });
    }
};

// Fonction pour récupérer l'état du lecteur Spotify
exports.getPlayerState = async (req, res) => {
    let accessToken = req.session.spotifyAccessToken;
    if (!accessToken) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return res.json(response.data); // Retourne l'état du lecteur
    } catch (error) {
        console.error("Erreur API Spotify (Player State):", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Erreur de récupération de l'état du lecteur Spotify" });
    }
};
