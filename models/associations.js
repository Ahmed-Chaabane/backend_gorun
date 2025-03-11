const Utilisateur = require('./Utilisateur');
const DefiParticipants = require('./DefiParticipants');
const DefiCommunautaire = require('./DefiCommunautaire');
const UtilisateurHydration = require('./UtilisateurHydration'); // Importation d'UtilisateurHydration
const HydrationGoal = require('./HydrationGoal'); // Importation de HydrationGoal

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

module.exports = {
    Utilisateur,
    DefiParticipants,
    DefiCommunautaire,
    UtilisateurHydration, // N'oubliez pas d'exporter UtilisateurHydration
    HydrationGoal, // N'oubliez pas d'exporter HydrationGoal
};
