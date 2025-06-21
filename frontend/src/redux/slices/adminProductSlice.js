import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`; // Base URL for the API
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`; 

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async () => {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
                headers: { 
                    Authorization: USER_TOKEN, // Authorization header with the user's token
            },
    });
        return response.data; // Return the fetched products
    }
);

// Async function to create a new product
export const createProduct = createAsyncThunk(
    "adminProducts/createProduct",
    async (productData) => { 
        const response =  await axios.post(
            `${API_URL}/api/admin/products`,
            productData, // Data for the new product
            {
                headers: { 
                    Authorization: USER_TOKEN, // Authorization header with the user's token
                },
            }
        );
        return response.data; // Return the created product data
    }
);

// Async thunk to update an existing product
export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${API_URL}/api/admin/products/${id}`,
            productData, // Data for the updated product
            {
                headers: { 
                    Authorization: USER_TOKEN, // Authorization header with the user's token
                },
            }
        );
        return response.data; // Return the updated product data
    }
);  

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id) => {
        await axios.delete(
            `${API_URL}/api/products/${id}`,
            {
                headers: { 
                    Authorization: USER_TOKEN }, // Authorization header with the user's token
            });
        return id; // Return the ID of the deleted product
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts", // Name of the slice
    initialState: {
        products: [], // Initial state for products
        loading: false, // Loading state
        error: null, // Error state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                state.products = action.payload; // Store the fetched products in the state
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request is rejected
                state.error = action.error.message; // Store the error message in the state
            })
        // Create product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload); // Add the new product to the products array
            })
            // Update product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex((product) => product._id === action.payload._id); // Find the index of the updated product
                if (index !== -1) {
                    state.products[index] = action.payload; // Update the product in the products array
                }
            })
            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product._id !== action.payload 
                ); // Remove the deleted product from the products array
            });
    },
});

export default adminProductSlice.reducer; // Export the reducer to be used in the store