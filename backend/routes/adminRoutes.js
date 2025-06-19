const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin


router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}); // On récupère tous les utilisateurs de la base de données.
        res.json(users); // On renvoie la liste des utilisateurs en réponse à la requête.
    } catch (error) {
        console.error("Error fetching users:", error); // On affiche une erreur dans la console si une erreur se produit lors de la récupération des utilisateurs.
        res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la récupération des utilisateurs.
    }
});

// @route POST /api/admin/users
// @desc Add a new user (Admin only)
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body; // On récupère les données de l'utilisateur à créer depuis le corps de la requête.

    try { 
        let user = await User.findOne({ email }); // On vérifie si un utilisateur avec l'email fourni existe déjà.
        if (user) {
            return res.status(400).json({ message: "User already exists" }); // Si l'utilisateur existe déjà, on renvoie une erreur 400 avec un message d'erreur.
        }

        user = new User({ 
            name, 
            email,
            password, 
            role : role || 'customer' // On crée un nouvel utilisateur avec les données fournies. Si le rôle n'est pas spécifié, on le définit par défaut à 'customer'.
        }); // On crée un nouvel utilisateur avec les données fournies.

        await user.save(); // On enregistre l'utilisateur dans la base de données.      
        res.status(201).json({message: "User created successfully", user}); // On renvoie un message de succès et les informations de l'utilisateur créé avec un statut 201 (créé).
    } catch (error) {
        console.error("Error creating user:", error); // On affiche une erreur dans la console si une erreur se produit lors de la création de l'utilisateur.
        res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la création de l'utilisateur.
    }
});

// @route PUT /api/admin/users/:id
// @desc Update user info (Admin only) - Name, email and role
// @access Private/Admin

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // On recherche l'utilisateur par son ID dans la base de données.
        if (user) {
            user.name = req.body.name || user.name; // On met à jour le nom de l'utilisateur si un nouveau nom est fourni.
            user.email = req.body.email || user.email; // On met à jour l'email de l'utilisateur si un nouvel email est fourni.
            user.role = req.body.role || user.role; // On met à jour le rôle de l'utilisateur si un nouveau rôle est fourni.
        }
        const updatedUser = await user.save(); // On enregistre les modifications dans la base de données.
        res.json({ message: "User updated successfully", user: updatedUser }); // On renvoie un message de succès et les informations de l'utilisateur mis à jour.
    } catch (error) {
        console.error("Error updating user:", error); // On affiche une erreur dans la console si une erreur se produit lors de la mise à jour de l'utilisateur.
        res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la mise à jour de l'utilisateur.
    }
})

// @route DELETE /api/admin/users/:id
// @desc Delete a user (Admin only)
// @access Private/Admin

router.delete('/:id', protect, admin, async (req, res) => {
try {
    const user = await User.findById(req.params.id); // On recherche l'utilisateur par son ID dans la base de données.
    if (user) {
        await user.deleteOne(); // On supprime l'utilisateur de la base de données.
        res.json({ message: "User deleted successfully" }); // On renvoie un message de succès indiquant que l'utilisateur a été supprimé avec succès.
    } else {
        res.status(404).json({ message: "User not found" }); // Si l'utilisateur n'est pas trouvé, on renvoie une erreur 404 (non trouvé) avec un message d'erreur.
    }
} catch (error) {
    console.error("Error deleting user:", error); // On affiche une erreur dans la console si une erreur se produit lors de la suppression de l'utilisateur.
    res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors de la suppression de l'utilisateur.
}
});
            
module.exports = router; // On exporte le routeur pour l'utiliser dans d'autres fichiers de l'application. Cela permet de modulariser le code et de séparer les routes liées à l'administration des utilisateurs des autres routes de l'application.