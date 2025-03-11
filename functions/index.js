const express = require('express');
const {RecommandationEntrainement} = require('../models/RecommandationEntrainement');
const {Utilisateur} = require('../models/Utilisateur');
const {ObjectifSportif } = require('../models/ObjectifSportif');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser les corps de requêtes JSON
app.use(bodyParser.json());

// Exemple d'endpoint pour récupérer un utilisateur par son email
app.get('/utilisateur/:email', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findOne({
      where: { email: req.params.email }
    });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Exemple d'endpoint pour créer une nouvelle recommandation d'entraînement
app.post('/recommandation', async (req, res) => {
  const { description, id_objectif_sportif, niveau_difficulte } = req.body;
  try {
    const newRecommandation = await RecommandationEntrainement.create({
      description,
      id_objectif_sportif,
      niveau_difficulte
    });
    res.status(201).json(newRecommandation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la recommandation' });
  }
});

// Exemple d'endpoint pour récupérer toutes les recommandations basées sur un objectif sportif
app.get('/recommandations/:objectifId', async (req, res) => {
  try {
    const recommandations = await RecommandationEntrainement.findAll({
      where: { id_objectif_sportif: req.params.objectifId }
    });
    res.json(recommandations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Exemple d'endpoint pour récupérer un objectif sportif par son id
app.get('/objectif/:id', async (req, res) => {
  try {
    const objectif = await ObjectifSportif.findByPk(req.params.id);
    if (!objectif) {
      return res.status(404).json({ message: 'Objectif sportif non trouvé' });
    }
    res.json(objectif);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
