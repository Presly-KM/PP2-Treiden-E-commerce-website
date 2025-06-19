const mongoose = require('mongoose');  // On importe mongoose pour interagir avec MongoDB.
const bcrypt = require('bcryptjs');    // On importe bcryptjs pour hasher les mots de passe.

const userSchema = new mongoose.Schema({  // On définit le schéma de données pour les utilisateurs.
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match:[/.+\@.+\..+/, 'Please enter a valid email address'] // On ajoute une validation pour l'email (un regex ?).
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],              // On définit les rôles possibles pour les utilisateurs.
            default: 'customer',                      // Le rôle par défaut est 'customer'.
        },
    },
    {timestamps: true}                                // On ajoute des timestamps pour createdAt et updatedAt.
);

// Middleware pour hasher le mot de passe avant de sauvegarder l'utilisateur dans la base de données.
userSchema.pre('save', async function(next) {        // UserSchema.pre est un middleware qui s'exécute avant de sauvegarder l'utilisateur dans la base de données. C'est un midlleware de mongoose qui s'exécute avant de sauvegarder un document dans la base de données. Il est utilisé pour effectuer des opérations avant la sauvegarde du document, comme le hachage du mot de passe dans ce cas. On utilise next pour s'assurer que le prochain middleware est appelé après l'exécution de ce middleware. Si on ne l'appelle pas, la requête restera bloquée et le document ne sera pas sauvegardé dans la base de données.
    if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, on passe au middleware suivant.
    const salt = await bcrypt.genSalt(10); // On génère un sel pour hasher le mot de passe.
    this.password = await bcrypt.hash(this.password, salt); // On hashe le mot de passe avec le sel généré.
    next(); // On passe au middleware suivant.
});

// Méthode pour vérifier le mot de passe entré par l'utilisateur contre le mot de passe hashé dans la base de données.
userSchema.methods.matchPassword = async function(enteredPassword) { // On définit une méthode pour vérifier le mot de passe.
    return await bcrypt.compare(enteredPassword, this.password); // On compare le mot de passe entré avec le mot de passe hashé dans la base de données.
};

module.exports = mongoose.model('User', userSchema); // On exporte le modèle User basé sur le schéma userSchema. Cela permet d'interagir avec la collection 'users' dans la base de données MongoDB. Mongoose va automatiquement créer une collection 'users' dans la base de données si elle n'existe pas déjà.

