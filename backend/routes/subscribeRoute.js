const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public

router.post('/subscribe', async (req, res) => {
    const { email } = req.body; // On récupère l'email de la requête

    if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // On vérifie si l'email est fourni, sinon on renvoie une erreur 400
    }

    try {
        // Vérifier si l'email existe déjà en tant que souscripteur (subscriber)
         let subscriber = await Subscriber.findOne({ email }); // On recherche un souscripteur avec l'email fourni
        if (subscriber) {
            return res.status(400).json({ message: 'Email is already subscribed' }); // Si l'email existe déjà, on renvoie une erreur 400
        }

        // Créer un nouveau souscripteur
        subscriber = new Subscriber({ email }); // On crée un nouvel objet Subscriber avec l'email fourni
        await subscriber.save(); // On enregistre le souscripteur dans la base de données

        res
        .status(201)
        .json({ message: 'Successfully subscribed to the newsletter !' }); // On renvoie un message de succès avec un statut 201
    } catch (error) {
        console.error('Error subscribing:', error); // On affiche l'erreur dans la console
        res.status(500).json({ message: 'Server Error' }); // On renvoie une erreur 500 en cas de problème serveur
    }
});

module.exports = router; // On exporte le routeur pour l'utiliser dans d'autres fichiers de l'application. Cela permet de modulariser le code et de séparer les routes liées aux abonnements des autres routes de l'application.