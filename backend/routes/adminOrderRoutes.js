const express = require('express');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email'); // On récupère toutes les commandes de la base de données et on remplit les informations de l'utilisateur associé.
        res.json(orders); // On renvoie la liste des commandes en réponse à la requête.
    } catch (error) {
        console.error("Error fetching orders:", error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération des commandes.
        res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la récupération des commandes.
    }
});

// @route PUT /api/admin/orders/:id   // On souhaite mettre à jour le statut d'une commande
// @desc Update order status (Admin only)  
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name"); // On recherche la commande par son ID dans la base de données.
        if (order) {
           order.status = req.body.status || order.status; // On met à jour le statut de la commande si un nouveau statut est fourni.
           order.isDelivered = 
             req.body.status === 'Delivered' ? true : order.isDelivered; // On met à jour le statut de livraison si le nouveau statut est 'Delivered'.
           order.deliveredAt = 
             req.body.status === 'Delivered' ? Date.now() : order.deliveredAt; // On met à jour la date de livraison si le nouveau statut est 'Delivered'.
     
           const updatedOrder = await order.save(); // On enregistre les modifications de la commande dans la base de données.
           res.json(updatedOrder); // On renvoie la commande mise à jour en réponse à la requête.
        } else {
            res.status(404).json({ message: "Order not found" }); // Si la commande n'est pas trouvée, on renvoie une erreur 404 (non trouvé).
        }
        } catch (error) {
        console.error("Error updating order:", error); // On affiche une erreur dans la console si une erreur se produit lors de la mise à jour de la commande.
        res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la mise à jour de la commande.
    }
});


// @route DELETE /api/admin/orders/:id
// @desc Delete an order (Admin only)   
// @access Private/Admin

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id); // On recherche la commande par son ID dans la base de données.
        if (order) {
            await order.deleteOne(); // On supprime la commande de la base de données.
            res.json({ message: "Order deleted successfully" }); // On renvoie un message de succès en réponse à la requête.
        } else {
            res.status(404).json({ message: "Order not found" }); // Si la commande n'est pas trouvée, on renvoie une erreur 404 (non trouvé).
        } 
    } catch (error) {
        console.error("Error deleting order:", error); // On affiche une erreur dans la console si une erreur se produit lors de la suppression de la commande.
        res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la suppression de la commande.
}
});
module.exports = router;