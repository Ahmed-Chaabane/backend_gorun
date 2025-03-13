const Notification = require('../models/Notification');

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
};

// Récupérer une notification aléatoire
exports.getRandomNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            order: sequelize.literal('RANDOM()'),
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve a random notification' });
    }
};

// Ajouter une nouvelle notification
exports.addNotification = async (req, res) => {
    try {
        const { message } = req.body;
        const newNotification = await Notification.create({ message });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Notification.destroy({ where: { id } });

        if (deleted) {
            res.json({ message: 'Notification deleted successfully' });
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
