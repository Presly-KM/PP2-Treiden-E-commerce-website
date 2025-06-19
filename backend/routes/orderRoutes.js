const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get('/my-orders', protect, async (req, res) => {                      // On définit la route GET pour récupérer les commandes de l'utilisateur connecté. On utilise le middleware 'protect' pour protéger cette route.
try {
    // Find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({           // On recherche les commandes de l'utilisateur connecté en utilisant son ID. On trie les commandes par date de création, de la plus récente à la plus ancienne.
        createdAt: -1                                                        // On recherche les commandes de l'utilisateur connecté en utilisant son ID. On trie les commandes par date de création, de la plus récente à la plus ancienne.
        }); // sort by most recent orders
        res.json(orders); // On renvoie les commandes trouvées en réponse à la requête.
} catch (error) {
    console.error("Error fetching orders:", error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération des commandes.
    res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la récupération des commandes.  
}
});

// @route POST /api/orders/:id
// @desc Get order details by ID
// @access Private

router.get('/:id', protect, async (req, res) => { // On définit la route GET pour récupérer les détails d'une commande par son ID. On utilise le middleware 'protect' pour protéger cette route.
try { 
    const order = await Order.findById(req.params.id).populate(
        "user", 
        "name email" // On utilise la méthode populate pour inclure les informations de l'utilisateur (nom et email) dans la réponse. Cela permet d'obtenir les détails de l'utilisateur associé à la commande.
    ); // On recherche la commande par son ID dans la base de données.

    if (!order) {
        return res.status(404).json({ message: "Order not found" }); // Si la commande n'existe pas, on renvoie une erreur 404 (non trouvé) avec un message d'erreur.
    }
    // On renvoie les détails de la commande trouvée en réponse à la requête.
    res.json(order);
} catch (error) {
    console.error("Error fetching order details:", error); // On affiche une erreur dans la console
    res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la récupération des détails de la commande.
}
    });


module.exports = router; // On exporte le routeur pour l'utiliser dans d'autres fichiers de l'application. Cela permet de modulariser le code et de séparer les routes liées aux commandes des autres routes de l'application.