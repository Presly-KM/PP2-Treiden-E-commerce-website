//Ce fichier va connecter notre application à la base de données MongoDB. 
const mongoose = require('mongoose');        // On importe mongoose pour interagir avec MongoDB.

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // On utilise la variable d'environnement MONGODB_URI pour se connecter à la base de données MongoDB. Cette variable doit être définie dans le fichier .env.
      console.log('MongoDB connected successfully'); // On affiche un message dans la console si la connexion est réussie.
    } catch (err) {
    console.error('MongoDB connection failed:', err); // On affiche un message d'erreur si la connexion échoue.}
    process.exit(1);                                  // On arrête le processus si la connexion échoue.
  }
  }

// On exporte la fonction connectDB pour pouvoir l'utiliser dans d'autres fichiers.
module.exports = connectDB;
