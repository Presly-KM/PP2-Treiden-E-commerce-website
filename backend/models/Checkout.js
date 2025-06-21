const mongoose = require("mongoose");   

const checkoutItemSchema = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    size:String,
    color:String,
},
{ _id: false }
);

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
        address: { type: String, required: true,},
        city: {type: String, required: true,},
        postalCode: {type: String, required: true,},
        country: {type: String, required: true,},
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pending",
    },
    paymentDetails: {
        type:mongoose.Schema.Types.Mixed, // Utilisé pour stocker des détails de paiement variés
    },
    isFinalized: {
        type: Boolean,
        default: false,
    },
    finalizedAt: {
        type: Date,
    },
},
{ timestamps: true } // Ajoute les champs createdAt et updatedAt
);

module.exports = mongoose.model("Checkout", checkoutSchema); // On exporte le modèle Checkout pour l'utiliser dans d'autres fichiers de l'application. Ce modèle représente la collection 'checkouts' dans la base de données MongoDB.
