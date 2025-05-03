const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

// Configuration des constantes
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// Scopes nécessaires
const SCOPES = [
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'user-modify-playback-state',
    'user-read-playback-state',
    'streaming'
].join(' ');

exports.login = (req, res) => {
    try {
        const authQuery = querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: SCOPES,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            show_dialog: false
        });

        res.redirect(`${SPOTIFY_AUTH_URL}?${authQuery}`);
    } catch (error) {
        console.error('Login redirect error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.callback = async (req, res) => {
    const { code, state } = req.query;
    const sessionId = state || Date.now().toString();

    try {
        // Échange du code d'autorisation contre des tokens
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

        // Construction de la réponse HTML avec les données d'authentification
        const responseHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Spotify Auth</title>
            <script>
                (function() {
                    const authData = {
                        type: 'spotify-auth-success',
                        access_token: '${tokenResponse.data.access_token}',
                        refresh_token: '${tokenResponse.data.refresh_token}',
                        expires_in: ${tokenResponse.data.expires_in},
                        session_id: '${sessionId}'
                    };
                    
                    // 1. Essayer la communication directe via postMessage
                    try {
                        if (window.opener && !window.opener.closed) {
                            window.opener.postMessage(authData, window.location.origin);
                            setTimeout(() => window.close(), 1000); // Fermeture après 1 seconde
                            return;
                        }
                    } catch (e) {
                        console.error('Direct communication failed:', e);
                    }
                    
                    // 2. Fallback : Stockage local avec mécanisme de vérification
                    const storageEvent = new CustomEvent('spotifyAuthUpdated', {
                        detail: authData
                    });
                    
                    localStorage.setItem('spotifyAuth', JSON.stringify(authData));
                    localStorage.setItem('spotifyAuthSession', sessionId);
                    localStorage.setItem('spotifyAuthTimestamp', Date.now());
                    document.dispatchEvent(storageEvent);
                    
                    // 3. Message visuel
                    document.getElementById('status').innerHTML = 'Connexion réussie! Fermeture automatique...';
                    setTimeout(() => window.close(), 2000); // Fermeture après 2 secondes
                    
                })();
            </script>
        </head>
        <body>
            <div id="status" style="text-align:center;margin-top:50px;">
                <p>Connexion en cours...</p>
            </div>
        </body>
        </html>
        `;
        res.send(responseHtml); // Envoi de la réponse HTML au navigateur
    } catch (error) {
        console.error('Spotify auth error:', error);
        // Gestion des erreurs : Envoi d'une page d'erreur
        res.status(500).send(`
        <html>
        <script>
            const errorData = {
                type: 'spotify-auth-error',
                error: 'Authentication failed',
                session_id: '${sessionId}'
            };
            
            try {
                window.opener?.postMessage(errorData, '*');
            } catch (e) {
                localStorage.setItem('spotifyAuthError', JSON.stringify(errorData));
            }
            setTimeout(() => window.close(), 2000); // Fermeture après 2 secondes
        </script>
        <body>
            <div style="text-align:center;margin-top:50px;color:red;">
                <p>Erreur de connexion</p>
            </div>
        </body>
        </html>
        `);
    }
};

exports.refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({
            error: 'refresh_token is required'
        });
    }

    try {
        const tokenData = querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        });

        const response = await axios.post(SPOTIFY_TOKEN_URL, tokenData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json({
            access_token: response.data.access_token,
            expires_in: response.data.expires_in
        });
    } catch (error) {
        console.error('Refresh token error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to refresh access token'
        });
    }
};

exports.getPlayerState = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Authorization header missing'
        });
    }

    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me/player`, {
            headers: {
                'Authorization': authHeader
            }
        });

        res.json(response.data || { status: 'No active device' });
    } catch (error) {
        handleSpotifyApiError(error, res);
    }
};

// Fonctions utilitaires
function sendAuthError(res, message) {
    res.status(400).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script>
        window.opener.postMessage({
          type: 'spotify-auth-error',
          error: '${message}'
        }, window.location.origin);
        window.close();
      </script>
    </head>
    <body>
      <p>Error: ${message}</p>
    </body>
    </html>
  `);
}

function handleSpotifyApiError(error, res) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error?.message || 'Spotify API error';

    console.error('Spotify API Error:', {
        status,
        message,
        details: error.response?.data || error.message
    });

    res.status(status).json({
        error: message,
        details: status === 500 ? undefined : error.response?.data
    });
}