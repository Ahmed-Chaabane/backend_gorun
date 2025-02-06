const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: '358465763062-0isj5g1km6p4nr01atoj1hagftotd1v7.apps.googleusercontent.com', // Utilisation des variables d'environnement
            clientSecret: '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',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback', // URL de callback avec valeur par défaut
        },
        (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Google profile:', profile); // Vérification des informations du profil
                const user = {
                    google_id: profile.id,
                    nom: profile.name.familyName,
                    prenom: profile.name.givenName,
                    email: profile.emails[0].value,
                };
                return done(null, user); // Passage de l'objet utilisateur à Passport
            } catch (error) {
                console.error("Erreur lors de la récupération du profil Google :", error);
                return done(error, null); // Gestion de l'erreur
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user); // Sérialisation de l'utilisateur
});

passport.deserializeUser((user, done) => {
    done(null, user); // Désérialisation de l'utilisateur
});

module.exports = passport;