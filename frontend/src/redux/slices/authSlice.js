import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'; // On importe createSlice et createAsyncThunk depuis Redux Toolkit pour créer un slice et gérer les actions asynchrones liées à l'authentification.
import axios from 'axios';                                      // On importe axios pour effectuer des requêtes HTTP vers l'API.

// Retrouver les informations et le token de l'utilisateur dans le localStorage si elles existent.
const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null; // On récupère les informations de l'utilisateur depuis le localStorage et on les parse en JSON. Si elles n'existent pas, on initialise userInfo à null.    

// Check for an existing guest ID in the localStorage or generate a new one if it doesn't exist.
const initialGuestId = 
 localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;  // On vérifie si un guestId existe déjà dans le localStorage, sinon on en génère un nouveau basé sur l'heure actuelle.
 localStorage.setItem("guestId", initialGuestId);                    // On stocke le guestId dans le localStorage pour une utilisation ultérieure.

 // Initial state 
 const initialState = {
    user: userFromStorage,   // On initialise l'état de l'utilisateur avec les informations récupérées du localStorage.
    guestId: initialGuestId, // On initialise l'état du guestId avec la valeur récupérée ou générée.
    loading: false,          // On initialise l'état de chargement à false.
    error: null,            // On initialise l'état d'erreur à null.
};

// Async thunk for User login
export const loginUser = createAsyncThunk(
    'auth/loginUser', // Nom de l'action
    async (userData, {rejectWithValue}) => { // Fonction asynchrone qui prend les données de l'utilisateur et un objet avec rejectWithValue pour gérer les erreurs.
        try {
            const response = await axios.post('/api/auth/login', userData); // On envoie une requête POST à l'API pour connecter l'utilisateur.
            localStorage.setItem("userInfo", JSON.stringify(response.data)); // On stocke les informations de l'utilisateur dans le localStorage.
            return response.data; // On retourne les données de la réponse.
        } catch (error) {
            return rejectWithValue(error.response.data); // En cas d'erreur, on rejette la promesse avec les données d'erreur.
        }
    }
);


 