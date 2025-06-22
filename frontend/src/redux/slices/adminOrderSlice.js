import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
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

// update order delivery status
export const updateOrderStatus = createAsyncThunk(                           // Ici on utilise createAsyncThunk pour créer une action asynchrone qui va mettre à jour le statut d'une commande. Cette action est appelée "adminOrders/updateOrderStatus" et prend en paramètre un objet contenant l'ID de la commande (id) et le nouveau statut (status) à mettre à jour. On utilise également rejectWithValue pour gérer les erreurs éventuelles lors de la mise à jour du statut de la commande.
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {                           // On définit la fonction asynchrone qui sera exécutée lorsque l'action sera appelée. Cette fonction prend en paramètre l'ID de la commande (id) et le nouveau statut (status) à mettre à jour, ainsi que rejectWithValue pour gérer les erreurs éventuelles lors de la mise à jour du statut de la commande.
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
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

// Delete an order
export const deleteOrder = createAsyncThunk(                               // Ici on utilise createAsyncThunk pour créer une action asynchrone qui va supprimer une commande. Cette action est appelée "adminOrders/deleteOrder" et prend en paramètre l'ID de la commande (id) à supprimer. On utilise également rejectWithValue pour gérer les erreurs éventuelles lors de la suppression de la commande.
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {                                     // On définit la fonction asynchrone qui sera exécutée lorsque l'action sera appelée. Cette fonction prend en paramètre l'ID de la commande (id) à supprimer, ainsi que rejectWithValue pour gérer les erreurs éventuelles lors de la suppression de la commande.
    try {
      await axios.delete(                                                  // On utilise axios pour envoyer une requête DELETE à l'API pour supprimer la commande. axios est une bibliothèque JavaScript qui permet d'effectuer des requêtes HTTP de manière simple et efficace.
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;

        // calculate total sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      //   Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })
      //   Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export default adminOrderSlice.reducer;
