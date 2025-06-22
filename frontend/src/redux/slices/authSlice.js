import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Check for an existing guest ID in the localStorage or generate a new One
const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk(        // Ici on utilise createAsyncThunk pour créer une action asynchrone c'est-à-dire une action qui peut être exécutée de manière asynchrone dans Redux. asynchrone signifie que l'action peut être exécutée en arrière-plan sans bloquer l'interface utilisateur. On utilise createAsyncThunk pour créer une action qui va envoyer une requête HTTP à l'API pour connecter un utilisateur. Cette action est appelée "auth/loginUser" et prend en paramètre les données de l'utilisateur (userData) à connecter. On utilise également rejectWithValue pour gérer les erreurs éventuelles lors de la connexion de l'utilisateur.
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {      // Ici on définit la fonction asynchrone qui sera exécutée lorsque l'action sera appelée. Cette fonction prend en paramètre les données de l'utilisateur (userData) à connecter et rejectWithValue pour gérer les erreurs éventuelles lors de la connexion de l'utilisateur.
    try {
      const response = await axios.post(          // On utilise axios pour envoyer une requête POST à l'API pour connecter l'utilisateur. axios est une bibliothèque JavaScript qui permet d'effectuer des requêtes HTTP de manière simple et efficace.
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData                                  // On envoie les données de l'utilisateur (userData) dans le corps de la requête POST. Ces données contiennent généralement l'email et le mot de passe de l'utilisateur pour la connexion.
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));     // On stocke les informations de l'utilisateur dans le localStorage sous la clé "userInfo". Cela permet de conserver les informations de l'utilisateur même après le rechargement de la page.
      localStorage.setItem("userToken", response.data.token);                  // On stocke le token de l'utilisateur dans le localStorage sous la clé "userToken

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);

      return response.data.user; // Return the user object from the response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {                           // Ici on utilise extraReducers pour gérer les actions asynchrones créées avec createAsyncThunk. On utilise builder pour ajouter des cas pour chaque action asynchrone. Par exemple, on ajoute un cas pour l'action "auth/loginUser" qui sera exécutée lorsque l'utilisateur se connecte. On utilise également builder pour ajouter des cas pour l'action "auth/registerUser" qui sera exécutée lorsque l'utilisateur s'inscrit. On utilise également builder pour ajouter des cas pour les actions asynchrones créées avec createAsyncThunk.
    builder
      .addCase(loginUser.pending, (state) => {            // Ici on ajoute un cas pour l'action "auth/loginUser" qui sera exécutée lorsque l'utilisateur se connecte. On utilise pending pour indiquer que l'action est en cours d'exécution. (state) est l'état actuel du slice, qui contient les informations de l'utilisateur, l'ID de l'invité, le chargement et les erreurs éventuelles.
        state.loading = true;                             // state.loading est une propriété de l'état qui indique si l'action est en cours d'exécution. On la met à true pour indiquer que l'action est en cours d'exécution. Ainsi, on peut afficher un indicateur de chargement dans l'interface utilisateur pendant que l'action est en cours d'exécution.
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;                     // Ici on ajoute un cas pour l'action "auth/loginUser" qui sera exécutée lorsque l'utilisateur se connecte avec succès. On utilise fulfilled pour indiquer que l'action a été exécutée avec succès. (state, action) sont les paramètres de la fonction. state est l'état actuel du slice, qui contient les informations de l'utilisateur, l'ID de l'invité, le chargement et les erreurs éventuelles. action.payload est la charge utile de l'action, qui contient les informations de l'utilisateur connecté.
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
