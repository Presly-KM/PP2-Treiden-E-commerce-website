import  { useState, useEffect } from "react";          // On importe useState et useEffect de React pour gérer l'état des filtres et les effets secondaires.
import { useNavigate, useSearchParams } from "react-router-dom";
                                                        
const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Ici on utilise useSearchParams pour obtenir et mettre à jour les paramètres de recherche dans l'URL. Ainsi, on peut filtrer les produits en fonction des paramètres de recherche. Par exemple, si l'utilisateur sélectionne un filtre, on peut mettre à jour les paramètres de recherche pour refléter ce filtre dans l'URL. Cela permet également de conserver l'état des filtres lors de la navigation entre les pages.
  const navigate = useNavigate()                              // On veut aussi se rendre sur le nouveau Url avec les nouveaux paramètres de recherche.  "useNavigate" est utilisé pour naviguer vers une nouvelle URL lorsque les filtres sont mis à jour. Cela permet de mettre à jour l'URL sans recharger la page, ce qui est utile pour les applications React basées sur le routage.
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];

  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];

  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];

  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]); // On utilise une constante pour convertir les paramètres de recherche en un objet (grace à Object.fromEntries()). Cela permet de manipuler plus facilement les paramètres de recherche dans l'URL. Si on regarde l'Url on a ces paramètres qu'on a grace à useSearchParams. Mais ces paramètres seront stockés sous forme d'un tableau de paires clé-valeur. Avec Object.fromEntries(), on peut convertir les informations en objets (ex : {category: 'Top Wear', maxPrice: 100} => params.category) Si je veux récupérer la catégorie, je peux faire params.category et ça me renverra "Top Wear" par exemple.

    setFilters({                                        // On utilise useState avec setFilters pour mettre à jour l'état des filtres avec les paramètres de recherche. Cela permet de synchroniser l'état des filtres avec les paramètres de l'URL, ce qui est utile pour conserver l'état des filtres lors de la navigation entre les pages.
      category: params.category || "",                  // La catégorie sera soit la valeur obtenue dans les paramètres de recherche, soit une chaîne vide si elle n'est pas définie. c'est necessaire parce que quand on reactualise la page, les informations doivent être chargés d'après le query string présent dans l'URL. Il en va de meme pour les autres valeurs
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [], // On vérfie si la taille est bien définie(apparait) dans les paramètres de recherche. And si c'est le cas, on la sépare en utilisant une virgule comme séparateur. Sinon, on initialise la taille à un tableau vide.
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,                 // On vérifie si le prix minimum est défini dans les paramètres de recherche. Si oui, on le convertit en entier. Sinon, on initialise le prix minimum à 0.
      maxPrice: params.maxPrice || 100,               // On vérifie si le prix maximum est défini dans les paramètres de recherche. Si oui, on le convertit en entier. Sinon, on initialise le prix maximum à 100.
    });
    setPriceRange([0, params.maxPrice || 100]);      // On initialise la plage de prix avec le prix maximum défini dans les paramètres de recherche ou 100 par défaut.
  }, [searchParams]);                                // On utilise useEffect pour mettre à jour les filtres lorsque les paramètres de recherche changent. Cela permet de synchroniser l'état des filtres avec les paramètres de l'URL.
// L'URL doit se mettre a jour quand l'utilisateur sélectionne un filtre spécifique. Ainsi, crééons une fonction qui gère le changement de filtres
  const handleFilterChange = (e) => {                // On récupère le nom, la valeur et d'autres propriétés de l'élément qui a déclenché l'événement. On utilise e.target pour accéder à l'élément qui a déclenché l'événement.
    const { name, value, checked, type } = e.target;  // On utilise la décomposition pour extraire les propriétés de l'élément qui a déclenché l'événement.
    let newFilters = { ...filters };                  // On crée une copie de l'état des filtres actuel pour éviter de modifier l'état directement.
  
    if (type === "checkbox") {                       // Si l'élément est une case à cocher, on vérifie si la case est cochée ou non.
       if (checked) {                                 // Si la case est cochée, on ajoute la valeur au tableau correspondant dans les filtres.
        newFilters[name] = [...(newFilters[name] || []), value];  // On utilise la syntaxe de décomposition pour ajouter la valeur au tableau existant. Si le tableau n'existe pas encore, on initialise un tableau vide. On ajoute la nouvelle valeur à l'élément existant par exemple si la taille "XS" est déja présente alors on ajoute la nouvelle taille au tableau des tailles comme ceci : ["XS", "S"].
       } else {                                      // Si la case n'est pas cochée, on filtre le tableau pour supprimer la valeur du tableau.
        newFilters[name] = newFilters[name].filter((item) => item !== value); // On utilise la méthode filter pour créer un nouveau tableau sans la valeur sélectionnée.    Par exemple si on a ["XS", "S"] cochés et qu'on décoche "S", alors le tableau devient ["XS"].
      }
    } else {
      newFilters[name] = value;                     // Si l'élément n'est pas une case à cocher, on met simplement à jour la valeur du filtre avec la nouvelle valeur autrement dit, on assigne simplement la valeur à la clé correspondante dans l'objet des filtres. 
    }
    setFilters(newFilters);                         // On met à jour l'état des filtres avec les nouveaux filtres.
    updateURLParams(newFilters);                    // On appelle la fonction updateURLParams pour mettre à jour les paramètres de recherche dans l'URL avec les nouveaux filtres. Cela permet de conserver l'état des filtres lors de la navigation entre les pages et de partager les filtres via l'URL.
  };
   
  const updateURLParams = (newFilters) => {                   // On crée une fonction pour mettre à jour les paramètres de recherche dans l'URL selon les filtres sélectionnés par l'utilisateur. Cette fonction sera appelée chaque fois que l'utilisateur modifie un filtre.
    const params = new URLSearchParams();                     // On crée une nouvelle instance de URLSearchParams pour manipuler les paramètres de recherche dans l'URL.
    // {category: 'Top Wear', size: ['XS', 'S']}              // Nos nouveaux filtres contiendront des objets avec des informations similaires à celles affichées ci-contre.
    Object.keys(newFilters).forEach((key) => {                // On parcourt les clés des nouveaux filtres pour les ajouter aux paramètres de recherche.}
     if(Array.isArray(newFilters[key]) && newFilters[key].length > 0) { // On vérifie si la valeur du filtre est un tableau et s'il contient des éléments. Si c'est le cas, on ajoute la clé et la valeur au paramètre de recherche. On utilise Array.isArray pour vérifier si la valeur est un tableau et newFilters[key].length > 0 pour s'assurer que le tableau n'est pas vide.
        params.append(key, newFilters[key].join(","));        // On utilise la méthode append pour ajouter la clé et la valeur au paramètre de recherche. On utilise la méthode join pour convertir le tableau en une chaîne de caractères séparée par des virgules. Par exemple, si on a ["XS", "S"], on les convertit en "XS,S".
     } else if (newFilters[key]) {                            // Si la valeur du filtre n'est pas un tableau, on l'ajoute directement au paramètre de recherche.
      params.append(key, newFilters[key]);                    // On utilise la méthode append pour ajouter la clé et la valeur au paramètre de recherche. Par exemple, si on a {category: 'Top Wear'}, on ajoute category=Top Wear aux paramètres de recherche. 
      }
   });
    setSearchParams(params);                                  // Avec le useState On met à jour les paramètres de recherche dans l'URL avec les nouveaux filtres.
    navigate(`?${params.toString()}`);                        // On utilise useNavigate pour naviguer vers la nouvelle URL avec les paramètres de recherche mis à jour. Cela permet de mettre à jour l'URL sans recharger la page, ce qui est utile pour les applications React basées sur le routage. La valeur des paramètres de l'URL sera donc qqchose comme ça // ?category=Bottom+Wear&size=XS%2CS   2C est ici la version encodé de la virgule dans l'URL.
  };

 const handlePriceChange = (e) => {                // On crée une fonction pour gérer le changement de la plage de prix.
    const newPrice = e.target.value; // On récupère la nouvelle valeur de la plage de prix à partir de l'événement.
    setPriceRange([0, newPrice]); // On met à jour l'état de la plage de prix avec la nouvelle valeur. On initialise le prix minimum à 0 et le prix maximum à la nouvelle valeur.   
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice }; // On crée une copie des filtres actuels et on met à jour le prix maximum avec la nouvelle valeur.  
    setFilters(filters); // On met à jour l'état des filtres avec les nouveaux filtres.
    updateURLParams(newFilters); // On appelle la fonction updateURLParams pour mettre à jour les paramètres de recherche dans l'URL avec les nouveaux filtres. Cela permet de conserver l'état des filtres lors de la navigation entre les pages et de partager les filtres via l'URL. 
  };

        return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

      {/*  Category Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category} // On vérifie si la catégorie actuelle est sélectionnée
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/*  Gender Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender} // On vérifie si le genre actuel est sélectionné
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/*  Color Filter */}
      <div className="mb-6">
       <label className="block text-gray-600 font-medium mb-2">Color</label>
       <div className="flex flex-wrap gap-2">
         {colors.map((color) => (
           <button 
           key={color} 
           name="color" 
           value={color}
           onClick={handleFilterChange}
           className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition 
           hover:scale-105 ${
            filters.color === color ? "ring-2 ring-blue-500" : ""
          }`}
              style={{ backgroundColor: color.toLowerCase() }}>
           </button>
          ))}
       </div>
      </div>

      {/*  Size Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
         {sizes.map((size) => (
           <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)} // On vérifie si la taille actuelle est sélectionnée
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
            </div>
          ))}
        </div>    

        {/*  Material Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
         {materials.map((material) => (
           <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)} // On vérifie si le matériau actuel est sélectionné
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
            </div>
          ))}
        </div> 

        {/*  Brand Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
         {brands.map((brand) => (
           <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)} // On vérifie si la marque actuelle est sélectionnée
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{brand}</span>
            </div>
          ))}
        </div>
      {/*  Price Range Filter */}
      <div className="mb-8">
       <label className="block text-gray-600 font-medium mb-2">
        Price Range
        
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
  
          />
          <div className="flex justify-between text-gray-600 mt-2">
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
      </div>
        

    </div>
  );
};
export default FilterSidebar;
