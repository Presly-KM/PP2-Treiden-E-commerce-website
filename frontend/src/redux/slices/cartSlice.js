import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";                                                // Axios est une bibliothèque JavaScript qui permet de faire des requêtes HTTP depuis le navigateur ou Node.js. Elle est souvent utilisée pour interagir avec des API RESTful. fetch est une API native du navigateur pour faire des requêtes HTTP, mais Axios offre une interface plus simple et plus puissante, avec des fonctionnalités supplémentaires comme la gestion des erreurs, les interceptors, et la possibilité d'annuler des requêtes. Dans ce cas, on utilise Axios pour faire des requêtes HTTP vers l'API backend pour gérer le panier d'achat (cart) de l'utilisateur ou de l'invité (guest). 

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: { userId, guestId },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(                      // Ici on utilise createAsyncThunk pour créer une action asynchrone qui met à jour la quantité d'un article dans le panier.
  "cart/updateCartItemQuantity",                                             // Cette action asynchrone est appelée "cart/updateCartItemQuantity" et sera utilisée pour mettre à jour la quantité d'un article dans le panier.
  async (                                                                    // Ici on définit la fonction asynchrone qui sera exécutée lorsque l'action sera appelée.
    { productId, quantity, guestId, userId, size, color },                   // On récupère les paramètres nécessaires pour mettre à jour la quantité d'un article dans le panier. A savoir : productId (l'ID du produit), quantity (la nouvelle quantité), guestId (l'ID de l'invité), userId (l'ID de l'utilisateur), size (la taille du produit) et color (la couleur du produit). En effet, on peut mettre à jour la quantité d'un article dans le panier en fonction de ces paramètres.
    { rejectWithValue }                                                      // On utilise rejectWithValue pour gérer les erreurs qui peuvent survenir lors de l'exécution de cette action asynchrone. En effet, si une erreur se produit lors de l'exécution de cette action asynchrone, on peut renvoyer une valeur d'erreur personnalisée en utilisant rejectWithValue. Par exemple, si une erreur se produit lors de la mise à jour de la quantité d'un article dans le panier, on peut renvoyer un message d'erreur personnalisé en utilisant rejectWithValue.
  ) => {
    try {
      const response = await axios.put(                                       // On utilise axios pour envoyer une requête PUT à l'API pour mettre à jour la quantité d'un article dans le panier.
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,                       // On utilise l'URL de l'API pour mettre à jour la quantité d'un article dans le panier.
        {
          productId,
          quantity,
          guestId,
          userId,
          size,
          color,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk(                             // On utilise createAsyncThunk pour créer une action asynchrone qui supprime un article du panier.
  "cart/removeFromCart",                                                    // Cette action asynchrone est appelée "cart/removeFromCart" et sera utilisée pour supprimer un article du panier.
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {  // On définit la fonction asynchrone qui sera exécutée lorsque l'action sera appelée. On récupère les paramètres nécessaires pour supprimer un article du panier. A savoir : productId (l'ID du produit), guestId (l'ID de l'invité), userId (l'ID de l'utilisateur), size (la taille du produit) et color (la couleur du produit). En effet, on peut supprimer un article du panier en fonction de ces paramètres.
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data: { productId, guestId, userId, size, color },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update item quantity";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item";
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
