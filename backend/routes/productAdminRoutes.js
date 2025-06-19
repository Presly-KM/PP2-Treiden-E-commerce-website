const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();
// @route GET /api/admin/products
// @desc Get all products (Admin only)
// Access Private/Admin

router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});            // On récupère tous les produits de la base de données.
        res.json(products);                                 // On renvoie la liste des produits en réponse à la requête.
    } catch (error) {
        console.error("Error fetching products:", error);   // On affiche une erreur dans la console si une erreur se produit lors de la récupération des produits.
        res.status(500).json({ message: "Server Error" });  // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la récupération des produits.
    }
});

module.exports = router;