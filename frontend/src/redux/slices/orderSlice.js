import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Order from '../../../../backend/models/Order';

// Async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`, 
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

// Async thunk to fetch orders details by ID 
export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails", 
    async (orderId, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
                },
            }   
        );
        return response.data; // Return the fetched order details
    } catch (error) {
        rejectWithValue(error.response.data); // Return error response if the request fails
    }   
}
);

const orderSlice = createSlice({
    name: 'orders', // Name of the slice
    initialState: {
        orders: [], // Initial state for orders
        totalOrders: 0, // Initial state for total orders count
        orderDetails: null, // Initial state for order details
        loading: false, // Loading state
        error: null, // Error state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Fetch user orders 
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
                state.error = null; // Reset error state
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                state.orders = action.payload; // Store the fetched orders in the state
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request is rejected
                state.error = action.payload.message; // Store the error message in the state
            })
        // Fetch order details by ID
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
                state.error = null; // Reset error state
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                state.orderDetails = action.payload; // Store the fetched orders in the state
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request is rejected
                state.error = action.payload.message; // Store the error message in the state
            });
    },
});