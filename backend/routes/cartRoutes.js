const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null; // If neither userId nor guestId is provided, return null  
};

// @route POST /api/cart
// @desc Add product to cart for a guest or logged-in user
// @access Public
router.post('/', async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body; //  On récupère les données du produit, la quantité, la taille, la couleur, l'ID de l'invité et l'ID de l'utilisateur depuis le corps de la requête. 
    try  {  
        const product = await Product.findById(productId); // On cherche le produit dans la base de données en utilisant l'ID du produit fourni dans la requête.
        if (!product) return res.status(404).json({ message: 'Product not found' }); // Si le produit n'est pas trouvé, on renvoie une erreur 404.
        

        // Vérifier si l'utilisateur est connecté ou s'il s'agit d'un invité
        let cart = await getCart(userId, guestId); // On appelle la fonction getCart pour récupérer le panier de l'utilisateur ou de l'invité.

        // Si le panier existe déjà, on met à jour le produit dans le panier
        if (cart) {
            const productIndex = cart.products.findIndex(     // On cherche l'index du produit dans le panier en fonction de l'ID du produit, de la taille et de la couleur.
                (p) =>
                    p.productId.toString() === productId &&   // La raison pour laquelle on veut ckeker l'index c'est parce que on veut s'assurer que les éléments du panier contiendront pas de doublons. Il veut en d'autres termes s'assurer que le panier ne contiendra pas deux fois le même produit avec le même ID de produit la même taille et la même couleur.
                    p.size === size &&
                    p.color === color
               );
            if (productIndex > -1) { // Si le produit existe déjà dans le panier, on met à jour la quantité.
                // Si le produit existe déjà dans le panier, on met à jour la quantité.
                cart.products[productIndex].quantity += quantity; // On ajoute la quantité au produit existant dans le panier.
            } else {
                // Ajouter un nouveau produit au panier
                cart.products.push({ // On ajoute un nouveau produit au panier avec les détails du produit, la quantité, la taille et la couleur.
                    productId,
                    name: product.name,
                    image: product.images[0].url, // On suppose que le produit a au moins une image.
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // définir le prix total du panier
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 
            0
        ); 
        await cart.save(); // On enregistre les modifications du panier dans la base de données.
            return res.status(200).json(cart); // On renvoie le panier mis à jour.
        } else {
            // On crée un nouveau panier si aucun panier n'existe pour l'utilisateur ou l'invité
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(), // On génère un guestId unique si l'utilisateur n'est pas connecté.
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url, // On suppose que le produit a au moins une image.
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity, // On définit le prix total du panier en fonction du produit ajouté.
            });
            return res.status(201).json(newCart); // On renvoie le nouveau panier créé.
        }
    } catch (error) {
        console.error(error); // On affiche une erreur dans la console si une erreur se produit lors de l'ajout du produit au panier.
        res.status(500).json({ message: 'Server Error' }); // On renvoie une erreur 500 en cas d'erreur serveur.
    }
});
      // @route PUT /api/cart
      // @desc Update product quantity in cart for a guest or logged-in user
      // @access Public

      router.put('/', async (req, res) => {
        const { productId, quantity, size, color, guestId, userId } = req.body; // On récupère les données du produit, la quantité, la taille, la couleur, l'ID de l'invité et l'ID de l'utilisateur depuis le corps de la requête.
        
        try {
            let cart = await getCart(userId, guestId); // On appelle la fonction getCart pour récupérer le panier de l'utilisateur ou de l'invité.
            if (!cart) return res.status(404).json({ message: 'Cart not found' }); // Si le panier n'est pas trouvé, on renvoie une erreur 404.
      
            const productIndex = cart.products.findIndex( // On cherche l'index du produit dans le panier en fonction de l'ID du produit, de la taille et de la couleur.
                (p) =>
                    p.productId.toString() === productId && // On vérifie si le produit existe déjà dans le panier.
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) { // Si le produit existe déjà dans le panier, on met à jour la quantité.
                // Update quantity
                if (quantity > 0) {
                    cart.products[productIndex].quantity = quantity; // On met à jour la quantité du produit dans le panier.
                } else {
                    cart.products.splice(productIndex, 1); // Si la quantité est inférieure ou égale à zéro, on supprime le produit du panier.
                }

                cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0); // On met à jour le prix total du panier en fonction des produits restants.
                await cart.save(); // On enregistre les modifications du panier dans la base de données.
                return res.status(200).json(cart); // On renvoie le panier mis à jour.
            } else {
                return res.status(404).json({ message: 'Product not found in cart' }); // Si le produit n'existe pas dans le panier, on renvoie une erreur 404.
            }
            } catch (error) {
            console.error(error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération du panier.
            return res.status(500).json({ message: 'Server Error' }); // On renvoie une erreur 500 en cas d'erreur serveur.
            }
        });

   // @route DELETE /api/cart
   //  @desc Remove product from cart 
    // @access Public
    router.delete('/', async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body; // On récupère les données du produit, la taille, la couleur, l'ID de l'invité et l'ID de l'utilisateur depuis le corps de la requête.
    try { 
        let cart = await getCart(userId, guestId); // On appelle la fonction getCart pour récupérer le panier de l'utilisateur ou de l'invité.
       
        if (!cart) return res.status(404).json({ message: 'Cart not found' }); // Si le panier n'est pas trouvé, on renvoie une erreur 404.

        const productIndex = cart.products.findIndex( // On cherche l'index du produit dans le panier en fonction de l'ID du produit, de la taille et de la couleur.
            (p) =>
                p.productId.toString() === productId && // On vérifie si le produit existe déjà dans le panier.
                p.size === size &&
                p.color === color
);

if (productIndex > -1) { // Si le produit existe déjà dans le panier, on le supprime.
    cart.products.splice(productIndex, 1); // On supprime le produit du panier.

    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0); // On met à jour le prix total du panier en fonction des produits restants.
    await cart.save(); // On enregistre les modifications du panier dans la base de données.
    return res.status(200).json(cart); // On renvoie le panier mis à jour.
} else {
    return res.status(404).json({ message: 'Product not found in cart' }); // Si le produit n'existe pas dans le panier, on renvoie une erreur 404.
    }
    } catch (error) {
        console.error(error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération du panier.
        return res.status(500).json({ message: 'Server Error' }); // On renvoie une erreur 500 en cas d'erreur serveur.
    }
    });

    // @route GET /api/cart
    // @desc Get logged-in user's cart or guest cart
    // @access Public

    router.get('/', async (req, res) => { // On protège cette route avec le middleware protect pour s'assurer que l'utilisateur est authentifié.
        const {userId, guestId} = req.query; // On récupère l'ID de l'utilisateur ou l'ID de l'invité depuis les paramètres de la requête.
        
        try {
            const cart = await getCart(userId, guestId); // On appelle la fonction getCart pour récupérer le panier de l'utilisateur ou de l'invité.
            if (cart) {
                res.json(cart); // Si le panier est trouvé, on renvoie le panier.
            } else {
                res.status(404).json({ message: 'Cart not found' }); // Si le panier n'est pas trouvé, on renvoie une erreur 404.
            }
        } catch (error) {
            console.error(error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération du panier.
            res.status(500).json({ message: 'Server Error' }); // On renvoie une erreur 500 en cas d'erreur serveur.
        }
    });

    // @route POST /api/cart/merge
    // @desc Merge guest cart into user cart on login
    // @access Private 
    router.post('/merge', protect, async (req, res) => { // On protège cette route avec le middleware protect pour s'assurer que l'utilisateur est authentifié.
        const { guestId } = req.body; // On récupère l'ID de l'invité depuis le corps de la requête.
        
        try {
            // On cherche le panier de l'invité et le panier de l'utilisateur connecté dans la base de données.
            const guestCart = await Cart.findOne({ guestId }); // On cherche le panier de l'invité dans la base de données en utilisant l'ID de l'invité fourni dans la requête.
            const userCart = await Cart.findOne({ user: req.user._id }); // On cherche le panier de l'utilisateur connecté dans la base de données en utilisant l'ID de l'utilisateur authentifié.
       
            if (guestCart) {
                if(guestCart.products.length === 0) {
                    return res.status(400).json({ message: 'Guest cart is empty' }); // Si le panier de l'invité est vide, on renvoie une erreur 400.
                }
            
             if (userCart) {
                // Si le panier de l'utilisateur existe déjà, on fusionne les produits du panier de l'invité dans le panier de l'utilisateur.
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) => // On cherche l'index du produit dans le panier de l'utilisateur en fonction de l'ID du produit, de la taille et de la couleur.  
                        item.productId.toString() === guestItem.productId.toString() && // On vérifie si le produit existe déjà dans le panier de l'utilisateur.
                        item.size === guestItem.size &&
                        item.color === guestItem.color
                    );

                    if (productIndex > -1) { 
                        // Si le produit existe déjà dans le panier de l'utilisateur, on met à jour la quantité.
                        userCart.products[productIndex].quantity += guestItem.quantity; // On ajoute la quantité au produit existant dans le panier de l'utilisateur.
                    } else {
                        // Si le produit n'existe pas dans le panier de l'utilisateur, on l'ajoute.
                        userCart.products.push(guestItem); // On ajoute le produit du panier de l'invité au panier de l'utilisateur.    
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity, 
                    0
                 ); // On met à jour le prix total du panier de l'utilisateur en fonction des produits restants.
                await userCart.save(); // On enregistre les modifications du panier de l'utilisateur dans la base de données.

                // On supprime le panier de l'invité après la fusion.
                try {
                    await Cart.findOneAndDelete({ guestId }); // On supprime le panier de l'invité de la base de données.
                } catch (error) {
                    console.error('Error deleting guest cart:', error); // On affiche une erreur dans la console si une erreur se produit lors de la suppression du panier de l'invité. 
                }
                res.status(200).json(userCart); // On renvoie le panier de l'utilisateur mis à jour.                    
            } else {
                // Si le panier de l'utilisateur n'existe pas, on crée un nouveau panier avec les produits du panier de l'invité.
                guestCart.user = req.user._id; // On associe le panier de l'invité à l'utilisateur connecté.
                guestCart.guestId = undefined; // On supprime l'ID de l'invité du panier, car l'utilisateur est maintenant connecté.
                await guestCart.save(); // On enregistre le panier de l'invité mis à jour dans la base de données.
                res.status(200).json(guestCart); // On renvoie le panier de  l'invité mis à jour, qui est maintenant associé à l'utilisateur connecté.
        }
    } else {
                if (userCart) {
                    // Si le panier de l'utilisateur a deja été merge, on ne fait rien et on renvoie le panier de l'utilisateur.
                    return res.status(200).json(userCart); // On renvoie le panier de l'utilisateur sans modifications.
                } 
                res.status(404).json({ message: 'Guest cart not found' }); // Si le panier de l'invité n'est pas trouvé, on renvoie une erreur 404.
            }
        } catch (error) {
            console.error(error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération des paniers.
            return res.status(500).json({ message: 'Server Error' }); // On renvoie une erreur 500 en cas d'erreur serveur.
        }
        });
module.exports = router; // On exporte le routeur pour l'utiliser dans d'autres fichiers de l'application. Cela permet de gérer les routes liées au panier dans l'application Express.