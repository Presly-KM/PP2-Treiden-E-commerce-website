const express = require('express');
const Product = require('../models/Product'); // On importe le modèle Product pour interagir avec la base de données.
const { protect, admin } = require('../middleware/authMiddleware'); // On importe le middleware 'protect' pour protéger les routes qui nécessitent une authentification.

const router = express.Router(); // On crée un routeur Express pour définir les routes liées aux produits.


// @route POST /api/products                      // Route pour la création de produits
// @desc Create a new Product
// @access Private (seul un utilisateur authentifié (un admin) peut créer un produit)
router.post('/', protect, admin, async (req, res) => {    // On définit la route POST pour créer un nouveau produit. C'est à dire que cette route sera utilisée pour envoyer une requête POST au serveur afin de créer un nouveau produit dans la base de données. Par exemple, le front-end pourrait envoyer une requête POST à cette route avec les données du produit dans le corps de la requête. 
    try {                                          // On utilise un bloc try-catch pour gérer les erreurs potentielles lors de la création du produit. Si une erreur se produit, elle sera capturée dans le bloc catch et on pourra renvoyer une réponse d'erreur appropriée.
        const {                                    // 
            name,  
            description, 
            price, 
            discountedPrice, 
            countInStock, 
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body; // On récupère les données du produit qui a été créé depuis le corps de la requête. C'est -à-dire que l'on attend que le front-end envoie un objet JSON contenant ces propriétés lors de la création d'un nouveau produit. Par exemple, le front-end pourrait envoyer une requête POST avec un corps JSON comme celui-ci :
        // {    
        //     "name": "Product Name",
        //     "description": "Product Description",
        //     "price": 100,
        //     "discountedPrice": 80,
        //     "countInStock": 50,
        //     "category": "Category Name",
        //     "brand": "Brand Name",
        //     "sizes": ["S", "M", "L"],
        //     "colors": ["Red", "Blue"],
        //     "collections": ["Collection1", "Collection2"],
        //     "material": "Cotton",    
        //          
    
        const product = new Product({             // On crée une nouvelle instance du modèle Product.
            name,
            description,
            price,
            discountedPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id, // On associe le produit nouvellement crée à l'utilisateur authentifié (l'admin) qui le crée. En d'autres termes, on enregistre l'ID de l'utilisateur qui a créé le nouveau produit dans le champ 'user' du modèle Product. Cela permet de savoir quel utilisateur a créé ce produit et de gérer les permissions d'accès et de modification ultérieurement.
        })    

        const createdProduct = await product.save(); // On enregistre le produit dans la base de données. La méthode save() est utilisée pour enregistrer l'instance du modèle Product dans la collection "products" de la base de données MongoDB. Elle renvoie une promesse qui se résout avec le produit créé.
        res.status(201).json(createdProduct); // On renvoie une réponse avec le produit créé et un statut HTTP 201 (Created) pour indiquer que le produit a été créé avec succès.
    } catch (error) { 
        console.error("Error creating product:", error); // On affiche une erreur dans la console si la création du produit échoue.
        res.status(500).send("Server Error"); // On renvoie une réponse 500 (Internal Server Error) si une erreur se produit lors de la création du produit.
    } 
});

// @route PUT /api/products/:id                // Route pour la mise à jour d'un produit
// @desc Update an existing Product
// @access Private                             //(seul un utilisateur authentifié (un admin) peut mettre à jour un produit)

router.put('/:id', protect, admin, async (req, res) => { // On définit la route PUT pour mettre à jour un produit existant. C'est à dire que cette route sera utilisée pour envoyer une requête PUT au serveur afin de mettre à jour un produit dans la base de données. Par exemple, le front-end pourrait envoyer une requête PUT à cette route avec l'ID du produit dans l'URL et les données mises à jour dans le corps de la requête.
    try {
       const {                                    // 
            name,  
            description, 
            price, 
            discountedPrice, 
            countInStock, 
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        // Find the product by ID
        const product = await Product.findById(req.params.id); // On recherche le produit dans la base de données en utilisant l'ID passé dans les paramètres de la requête (req.params.id). Cela permet de trouver le produit que l'on souhaite mettre à jour.
        if (product) { 
            // Update the product fields
            product.name = name || product.name;              // On met à jour les champs du produit avec les nouvelles valeurs fournies dans le corps de la requête. Si une valeur n'est pas fournie, on garde la valeur actuelle du produit.
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountedPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = 
             isFeatured !== undefined ? isFeatured : product.isFeatured; // On utilise !== undefined pour vérifier si la valeur est explicitement définie, car isFeatured peut être un booléen.
            product.isPublished = 
             isPublished !== undefined ? isPublished : product.isPublished; // On utilise !== undefined pour vérifier si la valeur est explicitement définie, car isPublished peut être un booléen.
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;      
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

             // Sauvegarder les products mis à jour
            const updatedProduct = await product.save(); // On enregistre les modifications apportées au produit dans la base de données. La méthode save() est utilisée pour enregistrer l'instance du modèle Product mise à jour dans la collection "products" de la base de données MongoDB. Elle renvoie une promesse qui se résout avec le produit mis à jour.
            res.json(updatedProduct); // On renvoie une réponse avec le produit mis à jour.
        } else {
            res.status(404).json({ message: "Product not found" }); // Si le produit n'est pas trouvé, on renvoie une réponse 404 (Not Found) avec un message d'erreur.
        }                                                                   
     } catch (error) {
        console.error(error); // On affiche une erreur dans la console si la mise à jour du produit échoue.
        res.status(500).send("Server Error"); // On renvoie une réponse 500 (Internal Server Error) si une erreur se produit lors de la mise à jour du produit.
     }
    });

    // @route DELETE /api/products/:id             // Route pour la suppression d'un produit
    // @desc Delete a Product by ID
    // @access Private                             //(seul un utilisateur authentifié (un admin) peut supprimer un produit)
   
     router.delete('/:id', protect, admin, async (req, res) => { // On définit la route DELETE pour supprimer un produit existant. C'est à dire que cette route sera utilisée pour envoyer une requête DELETE au serveur afin de supprimer un produit de la base de données. Par exemple, le front-end pourrait envoyer une requête DELETE à cette route avec l'ID du produit dans l'URL.   
        try {
            // Find the product by ID
            const product = await Product.findById(req.params.id); // On recherche le produit dans la base de données en utilisant l'ID passé dans les paramètres de la requête (req.params.id). Cela permet de trouver le produit que l'on souhaite supprimer.
           
            if (product) { 
             // Remove the product from the database
                await product.deleteOne(); // On supprime le produit de la base de données en utilisant la méthode deleteOne() du modèle Product. Cette méthode supprime l'instance du modèle Product de la collection "products" de la base de données MongoDB.
                res.json({ message: "Product removed" }); // On renvoie une réponse indiquant que le produit a été supprimé avec succès.    
            } else {
                res.status(404).json({ message: "Product not found" }); // Si le produit n'est pas trouvé, on renvoie une réponse 404 (Not Found) avec un message d'erreur.     
            }
            } catch (error) {
                console.error(error); // On affiche une erreur dans la console si la suppression du produit échoue.
                res.status(500).send("Server Error"); // On renvoie une réponse 500 (Internal Server Error) si une erreur se produit lors de la suppression du produit.
            }
        });

// @route GET /api/products/    
// @desc Get all products with optional query filters
// @access Public 

router.get('/', async (req, res) => { // On définit la route GET pour récupérer tous les produits. C'est à dire que cette route sera utilisée pour envoyer une requête GET au serveur afin de récupérer tous les produits de la base de données. Par exemple, le front-end pourrait envoyer une requête GET à cette route pour afficher tous les produits sur une page de liste de produits.
    try {
        const {
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
         } = req.query; // On récupère les paramètres de requête (query parameters) de la requête. Ces paramètres peuvent être utilisés pour filtrer, trier ou limiter les résultats des produits renvoyés par le serveur. Par exemple, on peut utiliser ces paramètres pour récupérer uniquement les produits d'une certaine collection, d'une certaine taille, d'une certaine couleur, d'un certain genre, d'un certain prix, etc.
    
        let query = {}; // On initialise un objet query vide qui sera utilisé pour construire la requête de recherche dans la base de données.
        
        // Logique de filtrage des produits en fonction des paramètres de requête
        if (collection &&  collection.toLocaleLowerCase() !== 'all') { // On vérifie si le paramètre de requête 'collection' est présent et s'il n'est pas égal à 'all'. Si c'est le cas, on ajoute un filtre pour la collection dans l'objet query.
            query.collections = collection;
        } 
        
        if (category && category.toLocaleLowerCase() !== 'all') { // On vérifie si le paramètre de requête 'category' est présent et s'il n'est pas égal à 'all'. Si c'est le cas, on ajoute un filtre pour la catégorie dans l'objet query.
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (size) {
            query.sizes = { $in: size.split(",") };
        }

        if (color) {
            query.colors = { $in: [color] }; // On ajoute un filtre pour la couleur dans l'objet query. On utilise l'opérateur $in pour vérifier si la couleur du produit est présente dans le tableau de couleurs fourni dans les paramètres de requête.
        }

        if(gender) { 
            query.gender = gender; // On ajoute un filtre pour le genre dans l'objet query. Cela permet de récupérer uniquement les produits qui correspondent au genre spécifié dans les paramètres de requête.        
        }

        if (minPrice || maxPrice) { // On vérifie si les paramètres de requête 'minPrice' ou 'maxPrice' sont présents. Si c'est le cas, on ajoute un filtre pour le prix dans l'objet query.
            query.price = {};
            if (minPrice) {
                query.price.$gte = Number(minPrice); // On ajoute un filtre pour le prix minimum dans l'objet query. On utilise l'opérateur gte (greater than or equal) pour vérifier si le prix du produit est supérieur ou égal au prix minimum spécifié dans les paramètres de requête.
            }
            if (maxPrice) {
                query.price.$lte = Number(maxPrice);  // On ajoute un filtre pour le prix maximum dans l'objet query. On utilise l'opérateur lte (less than or equal) pour vérifier si le prix du produit est inférieur ou égal au prix maximum spécifié dans les paramètres de requête. 
            }
        }

        if (search) { // On vérifie si le paramètre de requête 'search' est présent. Si c'est le cas, on ajoute un filtre pour la recherche dans l'objet query.
            query.$or = [ // On utilise l'opérateur $or pour rechercher des produits qui correspondent à l'un des critères suivants : le nom du produit, la description du produit ou la catégorie du produit. Cela permet de récupérer tous les produits qui contiennent le terme de recherche spécifié dans l'un de ces champs.
                { name: { $regex: search, $options: 'i' } }, // On utilise l'opérateur $regex pour effectuer une recherche insensible à la casse (i) dans le nom du produit.
                { description: { $regex: search, $options: 'i' } }, // On utilise l'opérateur $regex pour effectuer une recherche insensible à la casse (i) dans la description du produit. 
            ];
        }

        // Logique de tri des produits en fonction du paramètre de requête 'sortBy'
        let sort = {}; // On initialise un objet "sort" vide qui sera utilisé pour trier les produits en fonction du paramètre de requête 'sortBy'.
        if (sortBy) { // On vérifie si le paramètre de requête 'sortBy' est présent. Si c'est le cas, on utilise ce paramètre pour trier les produits.
            switch (sortBy) {
                    case "priceAsc": // Si le paramètre de requête 'sortBy' est égal à 'priceAsc', on trie les produits par prix croissant.
                       sort = { price: 1 }; // On utilise 1 pour indiquer un tri croissant.
                        break;
                    case "priceDesc": // Si le paramètre de requête 'sortBy' est égal à 'priceDesc', on trie les produits par prix décroissant.
                        sort = { price: -1 }; // On utilise -1 pour indiquer un tri décroissant.
                        break;
                    case "popularity": // Si le paramètre de requête 'sortBy' est égal à 'popularity', on trie les produits par popularité.
                        sort = { rating: -1}; // On utilise -1 pour indiquer un tri décroissant par note (rating).
                        break;
                        default: // Si le paramètre de requête 'sortBy' n'est pas reconnu, on ne fait pas de tri.
                        break;      
                }
          }

        // Chercher les produits dans la base de données en utilisant les filtres et le tri définis précédemment
        let products = await Product.find(query) // On utilise la méthode find() du modèle Product pour rechercher les produits dans la base de données en utilisant l'objet query construit précédemment. Cette méthode renvoie une promesse qui se résout avec un tableau de produits correspondant aux critères de recherche. 
            .sort(sort)                          // On utilise la méthode sort() pour trier les produits en fonction du critère de tri défini précédemment. Si aucun critère de tri n'est spécifié, les produits seront renvoyés dans l'ordre par défaut (généralement l'ordre d'insertion dans la base de données).
            .limit(Number(limit) || 0);          // On utilise la méthode limit() pour limiter le nombre de produits renvoyés. Si le paramètre de requête 'limit' n'est pas spécifié, on renvoie tous les produits (0 signifie pas de limite).
        res.json(products);                      // On renvoie les produits trouvés dans la base de données sous forme de réponse JSON. Cela permet au front-end de récupérer et d'afficher les produits sur la page de liste de produits.
    } catch (error) {                            // On utilise un bloc try-catch pour gérer les erreurs potentielles lors de la récupération des produits. Si une erreur se produit, elle sera capturée dans le bloc catch et on pourra renvoyer une réponse d'erreur appropriée.
        console.error(error); 
        res.status(500).send("server Error"); 
    }
});

// @route GET /api/products/best-seller        // Route pour récupérer les produits les plus vendus
// @desc Retrieve the product with the highest rating
// @access Public                              //(tout le monde peut récupérer les produits les plus vendus)
router.get('/best-seller', async (req, res) => { // On définit la route GET pour récupérer les produits les plus vendus. C'est à dire que cette route sera utilisée pour envoyer une requête GET au serveur afin de récupérer les produits les plus vendus de la base de données. Par exemple, le front-end pourrait envoyer une requête GET à cette route pour afficher les produits les plus vendus sur une page dédiée.  
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 }); // On utilise la méthode findOne() du modèle Product pour rechercher le produit avec la note (rating) la plus élevée. On utilise la méthode sort() pour trier les produits par note décroissante (-1) et on récupère le premier produit de la liste, qui sera le produit avec la note la plus élevée.
        if (bestSeller) {
                res.json(bestSeller); // Si un produit le plus vendu est trouvé, on renvoie ce produit sous forme de réponse JSON. Cela permet au front-end de récupérer et d'afficher les détails du produit le plus vendu sur la page dédiée.
        } else {
        res.status(404).json({ message: "No best seller product found" }); // Si aucun produit le plus vendu n'est trouvé, on renvoie une réponse 404 (Not Found) avec un message d'erreur.
        }        
    } catch (error) {
        console.error(error); // On affiche une erreur dans la console si la récupération du produit le plus vendu échoue.
        res.status(500).send("Server Error"); // On renvoie une réponse 500 (Internal Server Error) si une erreur se produit lors de la récupération du produit le plus vendu.
    }
});

// @route GET /api/products/:new-arrivals  // Route pour récupérer les nouveaux produits
// @desc Retrieve the latest 8 products  - Creation date
// @access Public                              //(tout le monde peut récupérer les nouveaux produits)

router.get('/new-arrivals', async (req, res) => { // On définit la route GET pour récupérer les nouveaux produits. C'est à dire que cette route sera utilisée pour envoyer une requête GET au serveur afin de récupérer les nouveaux produits de la base de données. Par exemple, le front-end pourrait envoyer une requête GET à cette route pour afficher les nouveaux produits sur une page dédiée.
    try {
        //Fetch the latest 8 products
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8); // On utilise la méthode find() du modèle Product pour récupérer tous les produits de la base de données. On utilise la méthode sort() pour trier les produits par date de création (createdAt) en ordre décroissant (-1) et on limite le nombre de produits renvoyés à 8 avec la méthode limit(8). Cela permet de récupérer les 8 derniers produits ajoutés à la base de données.
        res.json(newArrivals); // On renvoie les nouveaux produits trouvés dans la base de données sous forme de réponse JSON. Cela permet au front-end de récupérer et d'afficher les nouveaux produits sur la page dédiée.
    } catch (error) {   
        console.error(error); // On affiche une erreur dans la console si la récupération des nouveaux produits échoue.
        res.status(500).send("Server Error"); // On renvoie une réponse 500 (Internal Server Error) si une erreur se produit lors de la récupération des nouveaux produits.
    }
});


// @route GET /api/products/:id                // Route pour récupérer un produit par ID
// @desc Get a single product by ID
// @access Public                              //(tout le monde peut récupérer un produit par ID)
router.get('/:id', async (req, res) => { // On définit la route GET pour récupérer un produit par son ID. C'est à dire que cette route sera utilisée pour envoyer une requête GET au serveur afin de récupérer un produit spécifique de la base de données en utilisant son ID. Par exemple, le front-end pourrait envoyer une requête GET à cette route avec l'ID du produit dans l'URL pour afficher les détails d'un produit spécifique.
    try {
        const product = await Product.findById(req.params.id); // On utilise la méthode findById() du modèle Product pour rechercher un produit dans la base de données en utilisant l'ID passé dans les paramètres de la requête (req.params.id). Cela permet de trouver le produit que l'on souhaite récupérer.
        if (product) {
          res.json(product); // Si le produit est trouvé, on renvoie le produit sous forme de réponse JSON. Cela permet au front-end de récupérer et d'afficher les détails du produit sur la page de détails du produit.
        } else {
            console.error(error); // On affiche une erreur dans la console si le produit n'est pas trouvé.
            res.status(500).send("Server Error"); // Si le produit n'est pas trouvé, on renvoie une réponse 404 (Not Found) avec un message d'erreur.
        }
        } catch (error) {}
    });

    // @route GET /api/products/similar/:id      // Route pour récupérer des produits similaires
    // @desc Retrieve similar products based on the current product's gender and category  // On définit la route GET pour récupérer des produits similaires en fonction du genre et de la catégorie du produit actuel. C'est à dire que cette route sera utilisée pour envoyer une requête GET au serveur afin de récupérer des produits similaires à un produit spécifique de la base de données en utilisant son ID. Par exemple, le front-end pourrait envoyer une requête GET à cette route avec l'ID du produit dans l'URL pour afficher des produits similaires sur la page de détails du produit.
    // @access Public                              //(tout le monde peut récupérer des produits similaires)
router.get('/similar/:id', async (req, res) => { // On définit la route GET pour récupérer des produits similaires en fonction du genre et de la catégorie du produit actuel. C'est à dire que cette route sera utilisée pour envoyer une requête GET au serveur afin de récupérer des produits similaires à un produit spécifique de la base de données en utilisant son ID. Par exemple, le front-end pourrait envoyer une requête GET à cette route avec l'ID du produit dans l'URL pour afficher des produits similaires sur la page de détails du produit. 
    const { id } = req.params; // On récupère l'ID du produit actuel à partir des paramètres de la requête (req.params.id). Cet ID sera utilisé pour trouver le produit actuel dans la base de données et récupérer ses informations de genre et de catégorie.
    
    try {
        const product = await Product.findById(id); // On utilise la méthode findById() du modèle Product pour rechercher le produit actuel dans la base de données en utilisant l'ID récupéré précédemment. Cela permet de trouver le produit dont on souhaite récupérer les informations de genre et de catégorie.
        if (!product) {
            return res.status(404).json({ message: "Product not found" }); // Si le produit n'est pas trouvé, on renvoie une réponse 404 (Not Found) avec un message d'erreur.
        }

        const similarProducts = await Product.find({ // On utilise la méthode find() du modèle Product pour rechercher des produits similaires dans la base de données. On utilise les informations de genre et de catégorie du produit actuel pour filtrer les produits similaires.        
            _id: { $ne: id }, // On exclut le produit actuel de la recherche en utilisant l'opérateur $ne (not equal) pour s'assurer que le produit actuel n'est pas inclus dans les résultats.                         
            gender: product.gender, // On filtre les produits similaires en fonction du genre du produit actuel.
            category: product.category, // On filtre les produits similaires en fonction de la catégorie du produit actuel. 
        }).limit(4); // On limite le nombre de produits similaires renvoyés à 4 pour éviter de surcharger la réponse.
        
        res.json(similarProducts); // On renvoie les produits similaires sous forme de réponse JSON. Cela permet au front-end de récupérer et d'afficher des produits similaires sur la page de détails du produit.
       } catch (error) {
        console.error(error); // On affiche une erreur dans la console si la récupération des produits similaires échoue.
        res.status(500).send("Server Error"); // On renvoie une réponse 500 (Internal Server Error) si une erreur se produit lors de la récupération des produits similaires.
       }          
});

module.exports = router; // On exporte le routeur pour l'utiliser dans d'autres fichiers de l'application. Cela permet de centraliser la logique des routes liées aux produits et de les rendre accessibles depuis d'autres parties de l'application, comme le fichier principal du serveur (par exemple, app.js ou server.js).