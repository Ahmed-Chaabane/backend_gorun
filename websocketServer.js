const WebSocket = require('ws');

module.exports = function (server) {
    const wss = new WebSocket.Server({ server });

    // Tableau pour stocker les clients connectés
    const clients = [];

    wss.on('connection', (ws) => {
        console.log('Un client est connecté au serveur WebSocket.');
        clients.push(ws);  // Ajouter le client connecté au tableau

        // Envoi d'un message de bienvenue au client
        ws.send('Bienvenue sur le serveur WebSocket');

        // Logique pour envoyer des notifications à tous les clients connectés
        setTimeout(() => {
            sendNotificationToAll('Notification motivante: C\'est le moment de bouger !');
        }, 5000);

        // Écoute des messages venant du client
        ws.on('message', (message) => {
            console.log(`Message reçu du client: ${message}`);
        });

        ws.on('close', () => {
            console.log('Un client a fermé la connexion WebSocket.');
            // Supprimer le client de la liste des clients connectés
            const index = clients.indexOf(ws);
            if (index > -1) {
                clients.splice(index, 1);
            }
        });
    });

    console.log('Serveur WebSocket actif sur le port 8080');

    // Fonction pour envoyer une notification à tous les clients
    function sendNotificationToAll(message) {
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        console.log('Notification envoyée à tous les clients');
    }
};
