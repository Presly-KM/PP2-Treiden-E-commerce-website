import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';  

// Helper function to get cart items from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart items to localStorage
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
                params: { userId, guestId }
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
    async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => { 
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
                },
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productId, quantity, guestId, userId,size, color }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`, 
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
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios({
                method: 'DELETE', // Using DELETE method to remove an item
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`, 
                data: { productId, guestId, userId, size, color},
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Merge guest cart into user cart
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, user }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, 
            { guestId, user },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}` // Include user token for authentication
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
        cart: loadCartFromStorage(), // Load initial cart from localStorage
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] }; // Clear the cart
            localStorage.removeItem("cart"); // Remove cart from localStorage
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true; // Set loading state to true when fetching cart
                state.error = null; // Reset error state
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false; // Set loading state to false when fetch is successful
                state.cart = action.payload; // Update cart with fetched data
                saveCartToStorage(action.payload); // Save updated cart to localStorage
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on error
                state.error = action.error.message || "Failed to fetch cart"; // Set error state with error message
            })
        
            .addCase(addToCart.pending, (state) => {
                state.loading = true; // Set loading state to true when adding item to cart
                state.error = null; // Reset error state
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false; // Set loading state to false when add is successful
                state.cart = action.payload; // Update cart with new item
                saveCartToStorage(action.payload); // Save updated cart to localStorage
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on error
                state.error = action.payload?.message || "Failed to add to cart"; // Set error state with error message
            })
             .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true; // Set loading state to true when adding item to cart
                state.error = null; // Reset error state
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false; // Set loading state to false when add is successful
                state.cart = action.payload; // Update cart with new item
                saveCartToStorage(action.payload); // Save updated cart to localStorage
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on error
                state.error = 
                          action.payload?.message || "Failed to update item quantity"; // Set error state with error message
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true; // Set loading state to true when fetching cart
                state.error = null; // Reset error state
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false; // Set loading state to false when fetch is successful
                state.cart = action.payload; // Update cart with fetched data
                saveCartToStorage(action.payload); // Save updated cart to localStorage
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on error
                state.error = action.payload?.message || "Failed to remove item"; // Set error state with error message
            })
            .addCase(mergeCart.pending, (state) => {
                state.loading = true; // Set loading state to true when fetching cart
                state.error = null; // Reset error state
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false; // Set loading state to false when fetch is successful
                state.cart = action.payload; // Update cart with fetched data
                saveCartToStorage(action.payload); // Save updated cart to localStorage
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false; // Set loading state to false on error
                state.error = action.payload?.message || "Failed to merge cart"; // Set error state with error message
            })          
        },
});

export const { clearCart } = cartSlice.actions; // Exporting the clearCart action
export default cartSlice.reducer; // Exporting the cart reducer to be used in the store