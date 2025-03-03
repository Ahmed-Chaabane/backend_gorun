const admin = require('./config/firebase');  // Import Firebase Admin SDK
const Utilisateur = require('./models/Utilisateur'); // Importer le modèle Utilisateur

// Function to fetch all users from Firebase
async function syncUsersToLocalDB() {
    const users = [];
    let nextPageToken;

    do {
        const result = await admin.auth().listUsers(1000, nextPageToken);
        users.push(...result.users);
        nextPageToken = result.pageToken;
    } while (nextPageToken);

    return users;
}

// Function to insert or update users in PostgreSQL
// Fonction pour insérer ou mettre à jour les utilisateurs dans PostgreSQL
async function insertOrUpdateUsers(users) {
    for (let user of users) {
        const { email, uid, metadata } = user;
        const dateInscription = metadata.creationTime;
        const dateDerniereConnexion = metadata.lastSignInTime;

        // Exemple de valeurs par défaut si ces informations ne sont pas disponibles
        const defaultNom = "Inconnu";
        const defaultPrenom = "Inconnu";
        const defaultTaille = 0;  // Valeur par défaut
        const defaultPoids = 0;   // Valeur par défaut
        const defaultDateNaissance = new Date("2000-01-01");  // Valeur par défaut

        try {
            console.log(Utilisateur);
            // Vérifier si l'utilisateur existe déjà
            let utilisateur = await Utilisateur.findOne({
                where: { email: email },
            });

            if (utilisateur) {
                // L'utilisateur existe déjà, mise à jour
                utilisateur.firebase_uid = uid;
                utilisateur.date_inscription = dateInscription;
                // Mettez à jour d'autres champs si nécessaire
                await utilisateur.save();
                console.log(`Mise à jour de l'utilisateur ${email}`);
            } else {
                // L'utilisateur n'existe pas, insertion avec des valeurs par défaut
                await Utilisateur.create({
                    email: email,
                    firebase_uid: uid,
                    date_inscription: dateInscription,
                    nom: defaultNom,  // Ajouter le nom par défaut
                    prenom: defaultPrenom,  // Ajouter le prénom par défaut
                    taille: defaultTaille,  // Ajouter la taille par défaut
                    poids: defaultPoids,  // Ajouter le poids par défaut
                    date_naissance: defaultDateNaissance,  // Ajouter la date de naissance par défaut
                    // Ajoutez d'autres informations ici si nécessaires (par ex. téléphone, sexe, etc.)
                });
                console.log(`Utilisateur ${email} inséré`);
            }
        } catch (error) {
            console.error(`Erreur pour l'utilisateur ${email}:`, error);
        }
    }
}


// Main function that calls the sync
async function main() {
    try {
        const users = await syncUsersToLocalDB();
        await insertOrUpdateUsers(users);
        console.log('Utilisateurs synchronisés avec succès');
    } catch (error) {
        console.error('Erreur de synchronisation :', error);
    }
}

main();  // Run the main function
