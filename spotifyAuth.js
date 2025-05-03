const express = require("express");
const axios = require("axios");
const cors = require("cors");
const querystring = require("querystring");
require("dotenv").config();

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

router.use(cors());

router.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email user-top-read";
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
    })}`;
    res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            querystring.stringify({
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        res.json(response.data); // Retourne access_token et refresh_token
    } catch (error) {
        res.status(400).json({ error: "Échec de l'authentification" });
    }
});

module.exports = router;