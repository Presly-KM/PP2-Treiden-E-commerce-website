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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData); // On envoie une requête POST à l'API pour connecter l'utilisateur.
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));  // On stocke les informations de l'utilisateur dans le localStorage après une connexion réussie.
            localStorage.setItem("userToken", response.data.token); // On stocke le token de l'utilisateur dans le localStorage.
            return response.data.user;  // On retourne les données de l'utilisateur en cas de succès.
        } catch (error) {
            return rejectWithValue(error.response.data); // En cas d'erreur, on rejette la promesse avec les données d'erreur.
        }
    }
);

// Async thunk for User login
export const registerUser = createAsyncThunk(
    'auth/registerUser', // Nom de l'action
    async (userData, {rejectWithValue}) => { // Fonction asynchrone qui prend les données de l'utilisateur et un objet avec rejectWithValue pour gérer les erreurs.
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData); // On envoie une requête POST à l'API pour connecter l'utilisateur.
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));  // On stocke les informations de l'utilisateur dans le localStorage après une connexion réussie.
            localStorage.setItem("userToken", response.data.token); // On stocke le token de l'utilisateur dans le localStorage.
            return response.data.user;  // On retourne les données de l'utilisateur en cas de succès.
        } catch (error) {
            return rejectWithValue(error.response.data); // En cas d'erreur, on rejette la promesse avec les données d'erreur.
        }
    }
);

// Slice 
const authSlice = createSlice({
    name: 'auth', // Nom du slice
    initialState, // État initial défini précédemment
    reducers: {
        logout: (state) => { // Reducer pour déconnecter l'utilisateur
            state.user = null; // On réinitialise l'état de l'utilisateur à null.
            state.guestId = ` guest_${new Date().getTime()}`; // On génère un nouveau guestId.
            localStorage.removeItem("userInfo"); // On supprime les informations de l'utilisateur du localStorage.
            localStorage.removeItem("userToken"); // On supprime le token de l'utilisateur du localStorage.
            localStorage.removeItem("guestId", state.guestId); // On supprime le guestId du localStorage.  
        },
        generateNewGuestId: (state) => { // Reducer pour générer un nouveau guestId
            state.guestId = `guest_${new Date().getTime()}`; // On génère un nouveau guestId basé sur l'heure actuelle.
            localStorage.setItem("guestId", state.guestId); // On stocke le nouveau guestId dans le localStorage.   
    },
    },
    extraReducers: (builder) => { // On utilise extraReducers pour gérer les actions asynchrones.
        builder
        .addCase(loginUser.pending, (state) => { // Lorsque la requête de connexion est en cours, on met l'état de chargement à true.
            state.loading = true;   
            state.error = null; // On réinitialise l'état d'erreur à null.
        })
        .addCase(loginUser.fulfilled, (state, action) => { // Lorsque la requête de connexion est réussie, on met à jour l'état de l'utilisateur et on réinitialise l'état de chargement.
            state.loading = false; // On met l'état de chargement à false.
            state.user = action.payload; // On met à jour l'état de l'utilisateur avec les données retournées par la requête.
        })
        .addCase(loginUser.rejected, (state, action) => { // Lorsque la requête de connexion échoue, on met l'état de chargement à false et on enregistre l'erreur.
            state.loading = false; // On met l'état de chargement à false.
            state.error = action.payload.message; // On enregistre l'erreur retournée par la requête.
        });
        builder
        .addCase(registerUser.pending, (state) => { // Lorsque la requête d'inscription est en cours, on met l'état de chargement à true.
            state.loading = true;
            state.error = null; // On réinitialise l'état d'erreur à null.
        })
        .addCase(registerUser.fulfilled, (state, action) => { // Lorsque la requête d'inscription est réussie, on met à jour l'état de l'utilisateur et on réinitialise l'état de chargement.
            state.loading = false; // On met l'état de chargement à false.          
            state.user = action.payload; // On met à jour l'état de l'utilisateur avec les données retournées par la requête.
        })              
        .addCase(registerUser.rejected, (state, action) => { // Lorsque la requête d'inscription échoue, on met l'état de chargement à false et on enregistre l'erreur.
            state.loading = false; // On met l'état de chargement à false.
            state.error = action.payload.message; // On enregistre l'erreur retournée par la requête.
        });
    },
});

export const {logout, generateNewGuestId} = authSlice.actions; // On exporte les actions de déconnexion et de génération d'un nouveau guestId.
export default authSlice.reducer; // On exporte le reducer du slice pour l'utiliser dans le store Redux.
   

 