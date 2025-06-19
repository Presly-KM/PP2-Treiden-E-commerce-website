const express = require('express');
const User = require('../models/User'); // On importe le modèle User pour interagir avec la collection 'users' dans la base de données.
const jwt = require('jsonwebtoken'); // On importe jsonwebtoken pour générer et vérifier les tokens JWT.
const { protect } = require('../middleware/authMiddleware'); // On importe le middleware 'protect' pour protéger les routes qui nécessitent une authentification.
const router = express.Router();     // On crée un routeur Express pour définir les routes liées aux utilisateurs.

// @route POST /api/users/register   // route pour l'inscription des utilisateurs
// @desc Register a new user         // Description de la route pour l'inscription d'un nouvel utilisateur
// @access Public                     // Accès public, tout le monde peut accéder à cette route c'est-à-dire que tout le monde peut s'inscrire

router.post('/register', async (req, res) => {  // On définit la route POST pour l'inscription des utilisateurs. NB: On ne détermine pas maintenant l'API URL pour l'inscription des utilisateurs, on le fera plus tard dans le fichier server.js.
    const { name, email, password } = req.body; // On récupère les données de l'utilisateur depuis le corps de la requête.

    try {
        // logique d'inscription et d'enregistrement de l'utilisateur
         let user = await User.findOne({ email }); // On vérifie si l'utilisateur existe déjà dans la base de données en recherchant par email.
          if (user)  return res.status(400).json({ message: "User already exists" }); // Si l'utilisateur existe déjà, on renvoie une erreur 400 avec un message d'erreur.
        
        user = new User({ name, email, password }); // Sinon On crée un nouvel utilisateur avec les données fournies.
        await user.save();                  // On enregistre l'utilisateur dans la base de données.
        
        // Génération du token JWT Payload                               // On veut pouvoir envoyer un token en même temps que l'utilisateur est créé. On le fait à l'aide de jsonwebtoken. On va premièrement avoir besoin de créer un payload qui contient les informations de l'utilisateur que l'on veut envoyer dans le token. Comme par exemple son ID et son role. Le payload sera inclus dans le token JWT et on va le décoder pour authoriser l'utilisateur au backend. Le token JWT est un moyen sécurisé de transmettre des informations entre le client et le serveur. Il est signé numériquement pour garantir son intégrité et sa validité. Le token peut être utilisé pour authentifier l'utilisateur lors des requêtes ultérieures.
        const payload = { user: { id: user.id, role: user.role } };      // On crée un payload avec l'ID de l'utilisateur et son rôle.
       
        //Signature du token JWT et retour du token avec les informations de l'utilisateur
        jwt.sign(                          // On signe le token avec la clé secrète définie dans les variables d'environnement. On s'assurera que la clé sera d'au moins 32 caractères pour garantir la sécurité du token et qu'il contiendra des caractères spéciaux. On définit également une durée d'expiration de 40 heures pour le token. NB: La durée d'expiration est idéalement de 15 minutes pour des raisons de sécurité, mais ici on la met à 40 heures pour des raisons pratiques. On peut la modifier plus tard si nécessaire. Ensuite on utilise une fonction de rappel pour créer une erreur ou générer un token.
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
              if (err) throw err; 
             
              // On renvoie le token et les informations de l'utilisateur dans la réponse.
              res.status(201).json({ 
                user: {                           // On renvoie les informations de l'utilisateur (ID, nom, email et rôle).
                    _id: user .id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role,
                },       
                token                           // On renvoie le token JWT généré.
              });
            }
        );
       } catch (error) {
         console.log(error);                   // On affiche l'erreur dans la console.
         res.status(500).send("Server Error")  ; // On renvoie une erreur 500 en cas d'erreur serveur.
      }
   });

   // @route POST /api/users/login             // route pour la connexion des utilisateurs
   // @desc Authenticate user
   // @access Public
   router.post('/login', async (req, res) => { // On définit la route POST pour la connexion des utilisateurs.
    const { email, password } = req.body; // On récupère les données de l'utilisateur depuis le corps de la requête.
    try {
        // Trouver l'utilisateur par email
        let user = await User.findOne({ email }); // On vérifie si l'utilisateur existe déjà dans la base de données en recherchant par email.        
        if (!user) 
            return res.status(400).json({ message: "Invalid Credentials" }); // Si l'utilisateur n'existe pas, on renvoie une erreur 400 avec un message d'erreur.
        
        // Vérifier le mot de passe
        const isMatch = await user.matchPassword(password); // On vérifie si le mot de passe fourni correspond au mot de passe de l'utilisateur.   
        if (!isMatch) 
            return res.status(400).json({ message: "Invalid Credentials" }); // Si le mot de passe ne correspond pas, on renvoie une erreur 400 avec un message d'erreur.
    
        // Génération du token JWT Payload                               // On veut pouvoir envoyer un token en même temps que l'utilisateur est créé. On le fait à l'aide de jsonwebtoken. On va premièrement avoir besoin de créer un payload qui contient les informations de l'utilisateur que l'on veut envoyer dans le token. Comme par exemple son ID et son role. Le payload sera inclus dans le token JWT et on va le décoder pour authoriser l'utilisateur au backend. Le token JWT est un moyen sécurisé de transmettre des informations entre le client et le serveur. Il est signé numériquement pour garantir son intégrité et sa validité. Le token peut être utilisé pour authentifier l'utilisateur lors des requêtes ultérieures.
        const payload = { user: { id: user.id, role: user.role } };      // On crée un payload avec l'ID de l'utilisateur et son rôle.
       
        //Signature du token JWT et retour du token avec les informations de l'utilisateur
        jwt.sign(                          // On signe le token avec la clé secrète définie dans les variables d'environnement. On s'assurera que la clé sera d'au moins 32 caractères pour garantir la sécurité du token et qu'il contiendra des caractères spéciaux. On définit également une durée d'expiration de 40 heures pour le token. NB: La durée d'expiration est idéalement de 15 minutes pour des raisons de sécurité, mais ici on la met à 40 heures pour des raisons pratiques. On peut la modifier plus tard si nécessaire. Ensuite on utilise une fonction de rappel pour créer une erreur ou générer un token.
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
              if (err) throw err; 
             
              // On renvoie le token et les informations de l'utilisateur dans la réponse.
              res.json({ 
                user: {                           // On renvoie les informations de l'utilisateur (ID, nom, email et rôle).
                    _id: user .id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role,
                },       
                token,                           // On renvoie le token JWT généré.
              });
            }
        );

    } catch (error) {
        console.error(error);                   // On affiche l'erreur dans la console.
        res.status(500).send("Server Error")  ; // On renvoie une erreur 500 en cas d'erreur serveur.
    }
});                                        

// @route GET /api/users/profile                        // route pour récupérer le profil de l'utilisateur
// @desc Get logged-in user's profile (Protected route) // Description de la route pour récupérer le profil de l'utilisateur connecté (route protégée)
// @access Private                                      // Accès privé, seul l'utilisateur connecté peut accéder à cette route
router.get("/profile", protect, async (req, res) => {   // On définit la route GET pour récupérer le profil de l'utilisateur connecté. On utilise le middleware 'protect' pour protéger cette route.
    res.json(req.user);                                 // La réponse contient les informations de l'utilisateur connecté (lequel aura été comparé avec l'id utilisateur présent dans la base de donné MongoDb), qui sont stockées dans 'req.user' et assigné par le middleware 'protect' auquel d'ailleurs on consacre un fichier authMiddleware.js dans le dossier middleware. Ces informations sont extraites du token JWT envoyé dans l'en-tête d'autorisation de la requête. Le middleware 'protect' vérifie la validité du token et extrait les informations de l'utilisateur avant de les stocker dans 'req.user'.
});

module.exports = router; // On exporte le routeur pour l'utiliser dans le fichier server.js. Cela permet de définir les routes liées aux utilisateurs dans ce fichier et de les utiliser dans le fichier server.js. Ainsi, on peut organiser notre code de manière modulaire et réutilisable. On peut aussi ajouter d'autres routes liées aux utilisateurs dans ce fichier si nécessaire.