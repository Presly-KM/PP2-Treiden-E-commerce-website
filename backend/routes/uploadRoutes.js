const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

require('dotenv').config();

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Multer setup using memory storage
const storage = multer.memoryStorage();    // Ici nous utilisons le stockage en mémoire de Multer pour stocker les fichiers téléchargés temporairement avant de les envoyer à Cloudinary. En d'autres termes on dit a multer de stocker les fichiers uploadés directementn dans la ram en tant qu'objet buffer. Cela permet de manipuler les fichiers avant de les envoyer à Cloudinary, sans avoir à les enregistrer sur le disque local du serveur. 
const upload = multer({ storage });        // UPLOAD est une instance de Multer configurée pour utiliser le stockage en mémoire (ram ?). Cela signifie que les fichiers téléchargés seront stockés dans la mémoire du serveur plutôt que sur le disque local. En l'occurence, upload peut maintenant être utilisé comme middleware pour gérer les téléchargements de fichiers .

router.post("/", upload.single("image"), async (req,res) => {  // On définit une route POST pour gérer les téléchargements d'images. Le middleware 'upload.single("image")' permet de traiter un seul fichier avec le champ "image" dans le formulaire. Cela signifie que lorsque l'utilisateur télécharge une image, elle sera traitée par Multer et stockée en mémoire avant d'être envoyée à Cloudinary. le upload middleware on veut qu'il gere le uplad d'un seul fichier avec le champ "image" dans le formulaire, qui sera aprés disponible dans req.file. (request.file)
   try {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" }); // Si aucun fichier n'est téléchargé, on renvoie une erreur 400 (mauvaise requête) avec un message d'erreur.
    }

    // Function to handle the stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {                  // On définit un fichier par fonction pour gérer le téléchargement du fichier vers Cloudinary. Cette fonction prend en paramètre un tampon de fichier (fileBuffer) qui contient les données du fichier téléchargé. Ce const streamUpload convertit le tampon de fichier en un flux lisible et le télécharge vers Cloudinary grace a l'api d'upload de flux de ce dernier . Cela permet de télécharger le fichier directement depuis la mémoire sans avoir à l'enregistrer sur le disque local du serveur.
        return new Promise((resolve, reject) => { // On utilise une promesse pour gérer le téléchargement du fichier. Cela permet de gérer les opérations asynchrones de manière plus lisible et de renvoyer le résultat une fois le téléchargement terminé.
            const stream = cloudinary.uploader.upload_stream((error, result) => { // On crée un flux de téléchargement vers Cloudinary en utilisant la méthode 'upload_stream' de l'API Cloudinary. Cette méthode permet de télécharger des fichiers directement depuis un flux lisible, ce qui est utile pour les fichiers stockés en mémoire.
                if (result) {
                    resolve(result); // Si le téléchargement réussit, on résout la promesse avec le résultat du téléchargement.
                } else {
                  reject(error);   // Si une erreur se produit lors du téléchargement, on rejette la promesse avec l'erreur.
                }
            });
              // Use streamifier to convert the file buffer to a readable stream
            streamifier.createReadStream(fileBuffer).pipe(stream); // On utilise 'streamifier' pour convertir le tampon de fichier en un flux lisible et on le pipe (redirige) vers le flux de téléchargement Cloudinary. Cela permet d'envoyer les données du fichier directement à Cloudinary sans avoir à les enregistrer sur le disque local du serveur.
        });
    }

    // Call the stream upload function 
    const result = await streamUpload(req.file.buffer); // On appelle la fonction 'streamUpload' avec le tampon de fichier téléchargé (req.file.buffer) et on attend que le téléchargement soit terminé. Le résultat du téléchargement sera stocké dans la variable 'result'.
    
    // Responde with the uploaded file URL
    res.json({ imageUrl: result.secure_url }); // On renvoie l'URL sécurisée du fichier téléchargé en réponse à la requête. Cette URL peut être utilisée pour afficher l'image téléchargée dans l'application ou pour d'autres opérations. 'result.secure_url' contient l'URL de l'image téléchargée sur Cloudinary, qui est sécurisée et accessible publiquement.
  } catch (error) {
    console.error(error); // On affiche une erreur dans la console si une erreur se produit lors du téléchargement du fichier.
    res.status(500).json({ message: "Server Error" }); // On renvoie une erreur 500 (erreur serveur) si une erreur se produit lors du téléchargement du fichier. Cela permet de signaler au client que quelque chose s'est mal passé sur le serveur lors du traitement de la requête.
 }
});

module.exports = router; // On exporte le routeur pour l'utiliser dans d'autres fichiers de l'application. Cela permet de modulariser le code et de séparer les routes liées aux téléchargements d'images des autres routes de l'application. Ainsi, on peut organiser notre code de manière plus claire et réutilisable.