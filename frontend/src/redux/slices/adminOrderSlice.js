import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders (admin only)

export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders", 
     async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`, 
                {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
                },
                }
            );
            return response.data; // Return the fetched orders
        } catch (error) {
            return rejectWithValue(error.response.data); // Return error response if the request fails
        }
    }
);

// update order delivery status

export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus", 
     async ({ id, status } , { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, 
                { status }, 
                {
                 headers: { 
                 Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
                },
                }
            );
            return response.data; 
          } catch (error) {
            return rejectWithValue(error.response.data); // Return error response if the request fails
          }
    }
);

// Delete an order

export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder", 
     async ( id , { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,  
                {
                 headers: { 
                   Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
                },
              }
            );
            return id; 
          } catch (error) {
            return rejectWithValue(error.response.data); // Return error response if the request fails
      }
    }
);

const adminOrderSlice = createSlice({ 
    name: 'adminOrders', // Name of the slice
    initialState: {
        orders: [], // Initial state for orders
        totalOrders: 0, // Initial state for total orders count
        totalSales : 0, // Initial state for total sales
        loading: false, // Loading state
        error: null, // Error state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Fetch all orders
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true; // Set loading to true when the request is pending
            state.error = null; // Reset error state
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false; // Set loading to true when the request is pending
            state.orders = action.payload; // Reset error state
            state.totalOrders = action.payload.length; // Set total orders count

            // Calculate total sales
            const totalSales = action.payload.reduce((acc, order) => {
                return acc + order.totalPrice; // Sum up the total price of each order
            }, 0);
            state.totalSales = totalSales; // Set total sales
        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false; // Set loading to true when the request is pending
            state.error = action.payload.message; // Reset error state
        })
        // Update order status
        .addCase(updateOrderStatus.fulfilled, (state,action) => {
           const updatedOrder = action.payload; // Get the updated order from the action payload
           const orderIndex = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
           );  
              if (orderIndex !== -1) {
                state.orders[orderIndex] = updatedOrder; // Update the order in the orders array
              }
        })
        // Delete order
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter(
                (order) => order._id !== action.payload // Remove the deleted order from the orders array
              );  
        });
      },
});

export default adminOrderSlice.reducer; // Export the reducer to be used in the store

