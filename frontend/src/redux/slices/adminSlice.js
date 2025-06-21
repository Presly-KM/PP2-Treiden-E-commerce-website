import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  

// Fetch all users (admin only)

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, 
        {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}`}, // Authorization header with the user's token
        }
    );
    return response.data; // Return the fetched users
});

// Add the create user action 

export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, 
            userData, // Data for the new user
            {
              headers: { 
                Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
           },
         }
        );
        return response.data; // Return the created user data
    } catch (error) {
        return rejectWithValue(error.response.data); // Return error response if the request fails
    }
}
);

// Update user info 
export const updateUser = createAsyncThunk(
    "admin/updateUser", 
    async ({ id, name, email, role }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, 
            { name, email, role }, // Data for the updated user
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
            },
        }
        );
        return response.data.user; // Return the updated user data
    }
);

// Delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
     await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, 
        {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header with the user's token
       },
    }
     );
    return id; // Return the ID of the deleted user
});

const adminSlice = createSlice({
    name: "admin", // Name of the slice
    initialState: {
        users: [], // Initial state for users
        loading: false, // Loading state
        error: null, // Error state
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                state.users = action.payload; // Store the fetched users in the state
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request is rejected
                state.error = action.error.message; // Store the error message in the state
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload; // Get the updated user data from the action payload        
                const userIndex = state.users.findIndex(
                    (user) => user._id === updatedUser._id
            );
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser; // Update the user in the state
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload); // Remove the deleted user from the state
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true; // Set loading to true when the request is pending
                state.error = null; // Reset error state
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false; // Set loading to true when the request is pending
                state.users.push(action.payload.user) ;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false; // Set loading to true when the request is pending
                state.error = action.payload.message; // Reset error state
            });
        },
    });          

    export default adminSlice.reducer; // Export the reducer to be used in the store