const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subscriber', subscriberSchema); // On exporte le modèle Subscriber pour l'utiliser dans d'autres fichiers de l'application. Ce modèle représente la collection 'subscribers' dans la base de données MongoDB.
    