import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch products by collection and optional filters

export const fetchProductsByFilters = createAsyncThunk(    // On crée une action asynchrone pour récupérer les produits en fonction des filtres spécifiés.
"products/fetchByFilters",
async ({ 
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
}) => { // On définit les paramètres que l'on va utiliser pour filtrer les produits. Ces paramètres peuvent être passés par l'utilisateur pour affiner sa recherche de produits.
    const query = new URLSearchParams(); // On crée une instance de URLSearchParams pour construire la chaîne de requête à envoyer à l'API. Cela permet de gérer facilement les paramètres de la requête.
    if (collection) query.append("collection", collection); // On ajoute le paramètre de collection à la requête si il est spécifié.
    if (size) query.append("size", size); // On ajoute le paramètre de taille à la requête si il est spécifié.
    if (color) query.append("color", color); // On ajoute le paramètre de couleur à la requête si il est spécifié.      
    if (gender) query.apppend("gender", gender); // On ajoute le paramètre de genre à la requête si il est spécifié.
    if (minPrice) query.append("minPrice", minPrice); // On ajoute le paramètre de prix minimum à la requête si il est spécifié.
    if (maxPrice) query.append("maxPrice", maxPrice); // On ajoute le paramètre de prix maximum à la requête si il est spécifié.
    if (sortBy) query.append("sortBy", sortBy); // On ajoute le paramètre de tri à la requête si il est spécifié.
    if (search) query.append("search", search); // On ajoute le paramètre de recherche à la requête si il est spécifié.
    if (category) query.append("category", category); // On ajoute le paramètre de catégorie à la requête si il est spécifié.
    if (material) query.append("material", material); // On ajoute le paramètre de matériau à la requête si il est spécifié.
    if (brand) query.append("brand", brand); // On ajoute le paramètre de marque à la requête si il est spécifié.
    if (limit) query.append("limit", limit); // On ajoute le paramètre de limite à la requête si il est spécifié. Cela permet de limiter le nombre de produits renvoyés par l'API, ce qui peut être utile pour la pagination ou pour éviter de surcharger l'interface utilisateur avec trop de produits.
   
    const response = await axios.get(         // On effectue une requête GET à l'API pour récupérer les produits en fonction des filtres spécifiés. On utilise axios pour effectuer la requête HTTP. L'URL de l'API est construite en utilisant les paramètres de la requête.
`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}` // On utilise l'URL de base de l'API définie dans les variables d'environnement et on ajoute la chaîne de requête construite précédemment. Cela permet de récupérer les produits filtrés en fonction des critères spécifiés par l'utilisateur.
);
return response.data; // On retourne les données de la réponse de l'API, qui contiennent les produits filtrés en fonction des critères spécifiés par l'utilisateur.
}
);

// Async thunk to fetch a single product by ID              // On crée une action asynchrone pour récupérer un produit en fonction de son ID.
export const fetchProductDetails = createAsyncThunk(        // On crée une action asynchrone pour récupérer les détails d'un produit en fonction de son ID.
"products/fetchProductDetails",
async (id) => { // On crée une action asynchrone pour récupérer les détails d'un produit en fonction de son ID.
    const response = await axios.get( // On effectue une requête GET à l'API pour récupérer les détails du produit.
`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}` // On utilise l'URL de base de l'API définie dans les variables d'environnement et on ajoute l'ID du produit à la fin de l'URL. Cela permet de récupérer les détails du produit spécifié par l'utilisateur.
);
    return response.data; // On retourne les données de la réponse de l'API, qui contiennent les détails du produit spécifié par l'utilisateur.
}
);

// Async thunk to fetch similar products by  
export const updateProduct = createAsyncThunk(
"products/updateProduct",
async ({ id, productData }) => { 
    const response = await axios.put( // On effectue une requête PUT à l'API pour mettre à jour un produit existant.
`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, 
productData, 
{ 
    headers: { 
        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // On ajoute le token d'authentification dans les en-têtes de la requête pour autoriser l'accès à la ressource protégée. Le token est récupéré depuis le localStorage.
    },
  }
);
    return response.data; // On retourne les données de la réponse de l'API, qui contiennent les informations du produit mis à jour.
});


// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
"products/fetchSimilarProducts",
async ({ id }) => { // On crée une action asynchrone pour récupérer les produits similaires en fonction de l'ID du produit actuel.
  const response = await axios.get( // On effectue une requête GET à l'API pour récupérer les produits similaires.
   `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data; // On retourne les données de la réponse de l'API, qui contiennent les produits similaires au produit spécifié par l'utilisateur.     
  }
);

const productsSlice = createSlice({
    name: "products", 
    initialState: {
        products: [], // On initialise l'état des produits avec un tableau vide.
        selectedProduct: null, // On initialise l'état du produit sélectionné à null.
        similarProducts: [], // On initialise l'état des produits similaires avec un tableau vide.  
        loading: false, // On initialise l'état de chargement à false.
        error: null, // On initialise l'état d'erreur à null.       
        filters: {
            category: null, // On initialise les filtres avec des valeurs nulles.
            size: "", // On initialise le filtre de taille avec une chaîne vide.
            color: "", // On initialise le filtre de couleur avec une chaîne vide.
            gender: "", // On initialise le filtre de genre avec une chaîne vide.
            brand: "", // On initialise le filtre de marque avec une chaîne vide.
            minPrice: "", // On initialise le filtre de prix minimum avec une chaîne vide.
            maxPrice: "", // On initialise le filtre de prix maximum avec une chaîne vide.  
            sortBy: "", // On initialise le filtre de tri avec une chaîne vide.
            search: "", // On initialise le filtre de recherche avec une chaîne vide.   
            material: "", // On initialise le filtre de matériau avec une chaîne vide.
            collection: "", // On initialise le filtre de collection avec une chaîne vide.
        },
    },
    reducers: {
        setFilters: (state, action) => { // On crée un reducer pour mettre à jour les filtres.
            state.filters = { ...state.filters, ...action.payload }; // On met à jour les filtres en fusionnant l'état actuel des filtres avec les nouveaux filtres fournis dans l'action.
        },
        clearFilters: (state) => { // On crée un reducer pour réinitialiser les filtres.
            state.filters = { // On réinitialise les filtres à leurs valeurs initiales. 
                category: null,
                size: "",
                color: "",
                gender: "", // On initialise le filtre de genre avec une chaîne vide.
                brand: "", // On initialise le filtre de marque avec une chaîne vide.
                minPrice: "", // On initialise le filtre de prix minimum avec une chaîne vide.
                maxPrice: "", // On initialise le filtre de prix maximum avec une chaîne vide.  
                sortBy: "", // On initialise le filtre de tri avec une chaîne vide.
                search: "", // On initialise le filtre de recherche avec une chaîne vide.   
                material: "", // On initialise le filtre de matériau avec une chaîne vide.
                collection: "", // On initialise le filtre de collection avec une chaîne vide.
            };
        },
    },
    extraReducers: (builder) => { // On utilise extraReducers pour gérer les actions asynchrones.
        builder
        // handle fetch products with filter
        .addCase(fetchProductsByFilters.pending, (state) => { // Lorsque la requête de récupération des produits est en cours, on met l'état de chargement à true.
            state.loading = true; 
            state.error = null; // On réinitialise l'état d'erreur à null.
        })
        .addCase(fetchProductsByFilters.fulfilled, (state, action) => { // Lorsque la requête de récupération des produits est réussie, on met à jour l'état des produits et on réinitialise l'état de chargement.
            state.loading = false; // On met l'état de chargement à false.
            state.products = Array.isArray(action.payload) ? action.payload : []; // On met à jour l'état des produits avec les données retournées par la requête. On s'assure que les données sont un tableau, sinon on initialise l'état des produits avec un tableau vide.
        })
        .addCase(fetchProductsByFilters.rejected, (state, action) => { // Lorsque la requête de récupération des produits échoue, on met l'état de chargement à false et on enregistre l'erreur.
            state.loading = false; // On met l'état de chargement à false.
            state.error = action.error.message; // On enregistre l'erreur retournée par la requête.
        })
        // handle fetching product details
        .addCase(fetchProductDetails.pending, (state) => { // Lorsque la requête de récupération des détails du produit est en cours, on met l'état de chargement à true.
            state.loading = true; 
            state.error = null; // On réinitialise l'état d'erreur à null.
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => { // Lorsque la requête de récupération des détails du produit est réussie, on met à jour l'état du produit sélectionné et on réinitialise l'état de chargement.
            state.loading = false; // On met l'état de chargement à false.
            state.selectedProduct = action.payload; // On met à jour l'état du produit sélectionné avec les données retournées par la requête.
        })
        .addCase(fetchProductDetails.rejected, (state, action) => { // Lorsque la requête de récupération des détails du produit échoue, on met l'état de chargement à false et on enregistre l'erreur.
            state.loading = false; // On met l'état de chargement à false.
            state.error = action.error.message; // On enregistre l'erreur retournée par la requête.
        })
         // Handle updating product
        .addCase(updateProduct.pending, (state) => { // Lorsque la requête de mise à jour du produit est en cours, on met l'état de chargement à true.
            state.loading = true; 
            state.error = null; // On réinitialise l'état d'erreur à null.  
        })
        .addCase(updateProduct.fulfilled, (state, action) => { // Lorsque la requête de mise à jour du produit est réussie, on met à jour l'état du produit sélectionné et on réinitialise l'état de chargement.
            state.loading = false; // On met l'état de chargement à false.  
            const updatedProduct = action.payload; // On met à jour l'état du produit sélectionné avec les données retournées par la requête.
            const index = state.products.findIndex(  // On cherche l'index du produit mis à jour dans l'état des produits.
                (product) => product._id === updateProduct._id
            ); // On utilise la méthode findIndex pour trouver l'index du produit mis à jour dans l'état des produits en comparant l'ID du produit mis à jour avec l'ID de chaque produit dans l'état des produits.
            if (index !== -1) { // Si le produit mis à jour est trouvé dans l'état des produits, on le remplace par le produit mis à jour.
                state.products[index] = updatedProduct; // On remplace le produit dans l'état des produits par le produit mis à jour.
            }   
        })
        .addCase(updateProduct.rejected, (state, action) => { // Lorsque la requête de mise à jour du produit échoue, on met l'état de chargement à false et on enregistre l'erreur.
            state.loading = false; // On met l'état de chargement à false.
            state.error = action.error.message; // On enregistre l'erreur retournée par la requête.
        });
        },
    });