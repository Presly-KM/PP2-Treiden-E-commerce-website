import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating a checkout session
export const createCheckout = createAsyncThunk(
    'checkout/createCheckout', // Action name
    async (checkoutdata, {rejectWithValue}) => { // Function to create a checkout session
        try { 
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata, // Data for the checkout session 
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

const checkoutSlice = createSlice({
    name: 'checkout', // Name of the slice
    initialState: {
        checkout: null, // Initial state for the checkout session
        loading: false, // Loading state
        error: null, // Error state
    },
     reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createCheckout.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
                state.error = null; // Reset error state
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                state.checkout = action.payload; // Store the checkout session data in the state
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request is rejected
                state.error = action.payload.message; // Store the error message in the state
            });
    },
});

export default checkoutSlice.reducer; // Export the reducer to be used in the store