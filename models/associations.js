const Utilisateur = require('./Utilisateur');
const DefiParticipants = require('./DefiParticipants');
const DefiCommunautaire = require('./DefiCommunautaire');
const UtilisateurHydration = require('./UtilisateurHydration'); // Importation d'UtilisateurHydration
const HydrationGoal = require('./HydrationGoal'); // Importation de HydrationGoal
const ObjectifSportif = require('./ObjectifSportif');
const UtilisateurObjectif = require('./UtilisateurObjectif');
// Initialiser les associations

// 1. Un utilisateur peut participer à plusieurs défis communautaires
Utilisateur.hasMany(DefiParticipants, {
    foreignKey: 'firebase_uid',
    sourceKey: 'firebase_uid',
    as: 'defiParticipants',
});

DefiParticipants.belongsTo(Utilisateur, {
    foreignKey: 'firebase_uid',
    targetKey: 'firebase_uid',
    as: 'utilisateur',
});

// 2. Un défi communautaire peut avoir plusieurs participants
DefiCommunautaire.hasMany(DefiParticipants, {
    foreignKey: 'id_defi_communautaire',
    sourceKey: 'id_defi_communautaire',
    as: 'defiParticipants',
});

DefiParticipants.belongsTo(DefiCommunautaire, {
    foreignKey: 'id_defi_communautaire',
    targetKey: 'id_defi_communautaire',
    as: 'defi',
});

// 3. Un utilisateur peut avoir plusieurs objectifs d'hydratation
Utilisateur.hasMany(UtilisateurHydration, {
    foreignKey: 'id_utilisateur',  // Clé étrangère dans UtilisateurHydration
    sourceKey: 'id_utilisateur',   // Clé primaire dans Utilisateur
    as: 'utilisateurHydrations',   // Alias pour l'association
});

UtilisateurHydration.belongsTo(Utilisateur, {
    foreignKey: 'id_utilisateur',   // Clé étrangère dans UtilisateurHydration
    targetKey: 'id_utilisateur',    // Clé primaire dans Utilisateur
    as: 'utilisateurDetails',       // Nouveau nom d'alias pour éviter le conflit
});

// 4. Un objectif d'hydratation peut être lié à plusieurs utilisateurs
HydrationGoal.hasMany(UtilisateurHydration, {
    foreignKey: 'id_hydration_goal', // Clé étrangère dans UtilisateurHydration
    sourceKey: 'id',                 // Clé primaire dans HydrationGoal
    as: 'utilisateurHydrations',     // Alias pour l'association
});

UtilisateurHydration.belongsTo(HydrationGoal, {
    foreignKey: 'id_hydration_goal',  // Clé étrangère dans UtilisateurHydration
    targetKey: 'id',                  // Clé primaire dans HydrationGoal
    as: 'hydrationGoal',              // Alias pour l'association
});

// 5. Un utilisateur peut avoir plusieurs objectifs sportifs via la table pivot UtilisateurObjectif
Utilisateur.belongsToMany(ObjectifSportif, {
    through: UtilisateurObjectif,
    foreignKey: 'id_utilisateur', // Clé étrangère dans UtilisateurObjectif qui pointe vers Utilisateur
    otherKey: 'id_objectif_sportif', // Clé étrangère dans UtilisateurObjectif qui pointe vers ObjectifSportif
    as: 'objectifsSportifs', // Alias pour l'association
});

// 6. Un objectif sportif peut être associé à plusieurs utilisateurs via la table pivot UtilisateurObjectif
ObjectifSportif.belongsToMany(Utilisateur, {
    through: UtilisateurObjectif,
    foreignKey: 'id_objectif_sportif', // Clé étrangère dans UtilisateurObjectif qui pointe vers ObjectifSportif
    otherKey: 'id_utilisateur', // Clé étrangère dans UtilisateurObjectif qui pointe vers Utilisateur
    as: 'utilisateurs', // Alias pour l'association
});

// 7. Définir les relations directes avec la table pivot UtilisateurObjectif
Utilisateur.hasMany(UtilisateurObjectif, {
    foreignKey: 'id_utilisateur',
    sourceKey: 'id_utilisateur',
    as: 'liensObjectifsSportifs', // Alias pour l'association directe avec UtilisateurObjectif
});

UtilisateurObjectif.belongsTo(Utilisateur, {
    foreignKey: 'id_utilisateur',
    targetKey: 'id_utilisateur',
    as: 'utilisateurLien', // Alias pour l'association inverse
});

ObjectifSportif.hasMany(UtilisateurObjectif, {
    foreignKey: 'id_objectif_sportif',
    sourceKey: 'id_objectif_sportif',
    as: 'liensUtilisateurs', // Alias pour l'association directe avec UtilisateurObjectif
});

UtilisateurObjectif.belongsTo(ObjectifSportif, {
    foreignKey: 'id_objectif_sportif',
    targetKey: 'id_objectif_sportif',
    as: 'objectif_sportif', // Alias corrigé
});

module.exports = {
    Utilisateur,
    DefiParticipants,
    DefiCommunautaire,
    UtilisateurHydration, // N'oubliez pas d'exporter UtilisateurHydration
    HydrationGoal, // N'oubliez pas d'exporter HydrationGoal
};
