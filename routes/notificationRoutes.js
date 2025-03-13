const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Récupérer toutes les notifications
router.get('/', notificationController.getAllNotifications);

// Récupérer une notification aléatoire
router.get('/random', notificationController.getRandomNotification);

// Ajouter une notification
router.post('/', notificationController.addNotification);

// Supprimer une notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
