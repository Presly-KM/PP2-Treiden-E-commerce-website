const jwt = require("jsonwebtoken"); // On importe le module jsonwebtoken pour la gestion des tokens JWT.
const User = require("../models/User"); // On importe le modèle User pour interagir avec la base de données.

// Midlleware pour protéger les routes
const protect = async (req, res, next) => {    
    let token; // On initialise une variable pour stocker le token.

    if (
        req.headers.authorization &&                   // On vérifie si l'en-tête d'autorisation est présent dans la requête. L'en-tête d'autorisation est généralement utilisé pour envoyer des informations d'authentification, comme un token JWT, avec la requête. Il contient souvent un token qui permet au serveur de vérifier l'identité de l'utilisateur et de déterminer s'il est autorisé à accéder à la ressource demandée. un token 
        req.headers.authorization.startsWith("Bearer") // On vérifie si le token est présent dans les en-têtes de la requête et si cette en-tête commence par le préfixe "Bearer" (ou alors c'est nous qui ajoutons ici Bearer ?..Pas sûr). On va assigné cet en-tête avec la mention Bearer au début a la suite d'une requete de connexion au profil
  ) {      
      try {
         token = req.headers.authorization.split(" ")[1]; // On extrait le token de l'en-tête d'autorisation en le séparant par un espace et en prenant la deuxième partie (l'index 1). En d'autres termes, on prend le token qui suit le mot "Bearer" dans l'en-tête d'autorisation.
         const decoded = jwt.verify(token, process.env.JWT_SECRET); // On vérifie la validité du token envoyé du front-end en le décodant avec la clé secrète définie dans les variables d'environnement. Si le token est valide, on obtient les informations de l'utilisateur décodées. 
       
         req.user = await User.findById(decoded.user.id).select("-password"); // On recherche l'utilisateur dans la base de données en utilisant l'ID extrait du token décodé. On utilise la méthode select pour exclure le mot de passe de l'utilisateur des résultats renvoyés.
         next(); // On appelle la fonction next() pour passer au middleware suivant ou à la route protégée.
        } catch (error) {
            console.error("Token verification failed:", error); // On affiche une erreur dans la console si la vérification du token échoue.
            res.status(401).json({ message: "Not authorized, token failed" }); // On renvoie une réponse 401 (non autorisé) si le token n'est pas valide ou a expiré.
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token provided" }); // Si aucun token n'est présent dans l'en-tête d'autorisation, on renvoie une réponse 401 (non autorisé) avec un message indiquant qu'aucun token n'a été fourni.
    }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") { // On vérifie si l'utilisateur est authentifié et s'il a le rôle d'administrateur.
        next();                                 // Si c'est le cas, on appelle la fonction next() pour passer au middleware suivant ou à la route protégée.
    } else {
        res.status(403).json({ message: "Access denied, admin only" }); // Si l'utilisateur n'est pas un administrateur, on renvoie une réponse 403 (interdit) avec un message indiquant que l'accès est réservé aux administrateurs.
    }
}


module.exports = { protect, admin }; // On exporte le middleware protect pour l'utiliser dans d'autres fichiers de routes. Cela permet de protéger les routes qui nécessitent une authentification en vérifiant la présence et la validité du token JWT dans les requêtes entrantes.