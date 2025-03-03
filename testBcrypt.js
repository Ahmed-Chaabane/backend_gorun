const bcrypt = require('bcrypt');
const plaintext = "ahmed1919";
const hash = "$2b$10$N9jjPcE74obR68WHevgdAe1yshYO2cySzElg4FBUB69ZwqxJ7n/UG"; // Hash récupéré lors du login

bcrypt.compare(plaintext, hash, (err, result) => {
    if (err) {
        console.error("Erreur lors de la comparaison :", err);
    } else {
        console.log("Mot de passe valide ?", result); // Attendu : true
    }
});
