const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // On importe le modèle Product pour interagir avec la collection 'products' dans la base de données.
const User = require('./models/User'); // On importe le modèle User pour interagir avec la collection 'users' dans la base de données.
const Cart = require('./models/Cart'); // On importe le modèle Cart pour interagir avec la collection 'carts' dans la base de données.
const Checkout = require('./models/Checkout'); // On importe le modèle Checkout pour interagir avec la collection 'checkouts' dans la base de données.
const Order = require('./models/Order'); // On importe le modèle Order pour interagir avec la collection 'orders' dans la base de données.

const products = require("./data/products"); // On importe les données des produits depuis un fichier JSON.

dotenv.config();  // On charge les variables d'environnement depuis le fichier .env.

// Fonction pour se connecter à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI);

// Fonction pour alimenter la base de données 
const seedData = async () => {
    try {
        // Supprimer les données existantes 
        await Product.deleteMany();
        await User.deleteMany(); // On supprime les utilisateurs existants
        await Cart.deleteMany(); // On supprime les paniers existants
        await Checkout.deleteMany();
        await Order.deleteMany();
        
        // Créer un utilisateur administrateur par défaut 
        const createdUser = await User.create({ // On crée un nouvel utilisateur avec les données fournies.
            name: "Admin User",
            email: "admin@example.com",
            password: "123456", //
            role: "admin", 
        });

        // Assigner l'id de l'utilisateur par défaut à chaque produit
        const userID = createdUser._id; // On récupère l'ID de l'utilisateur créé pour l'utiliser dans les produits.

        const sampleProducts = products.map((product) => {
            return { ...product, user: userID };       
        }); 

        // Inserer les produits dans la base de données 
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully");
        process.exit(); // On termine le processus une fois que les données ont été insérées avec succès.
        } catch (error) {
          console.error("Error seeding the data:", error); // On affiche un message d'erreur si une erreur se produit lors de l'insertion des données.
          process.exit(1); // On arrête le processus en cas d'erreur.
        }
 };
 

 seedData(); // On appelle la fonction seedData pour démarrer le processus d'insertion des données dans la base de données.
    

       

        