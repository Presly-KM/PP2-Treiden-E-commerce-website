import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
import axios from "axios";

const EditProductPage = () => {                             // Ici, on crée un composant EditProductPage qui permet d'éditer les détails d'un produit. Ce composant utilise les hooks useEffect, useState, useDispatch et useSelector de React et Redux pour gérer l'état du produit sélectionné, les actions de récupération et de mise à jour des produits, ainsi que la navigation.
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(  // Ici, on utilise useSelector pour accéder à l'état du produit sélectionné, du chargement et des erreurs dans le store Redux. selectedProduct contient les détails du produit sélectionné, loading indique si la récupération des détails du produit est en cours, et error contient les erreurs éventuelles lors de la récupération des détails du produit.
    (state) => state.products                               // selectedProduct est l'état du produit sélectionné, loading est l'état de chargement, et error est l'état des erreurs. Ces états sont gérés par le slice productsSlice dans le store Redux. State.products est l'état du slice productsSlice dans le store Redux, qui contient les détails du produit sélectionné, l'état de chargement et les erreurs éventuelles lors de la récupération des détails du produit. Ainsi, on peut accéder à ces états dans le composant EditProductPage pour afficher les détails du produit sélectionné, l'état de chargement et les erreurs éventuelles lors de la récupération des détails du produit.
  );

  const [productData, setProductData] = useState({         // Ici, on initialise l'état productData avec un objet contenant les propriétés du produit. Ces propriétés sont initialisées avec des valeurs par défaut, comme une chaîne vide pour le nom et la description, 0 pour le prix et le stock, etc. Cela permet de s'assurer que le formulaire d'édition de produit a des valeurs initiales valides avant que l'utilisateur ne les modifie.
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); // Image uploading state

  useEffect(() => {                                  // 
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {                           // Ici, on crée une fonction handleChange qui est appelée lorsque l'utilisateur modifie un champ du formulaire. Cette fonction met à jour l'état productData avec la nouvelle valeur du champ modifié. On utilise e.target.name pour obtenir le nom du champ modifié et e.target.value pour obtenir la nouvelle valeur du champ. Ensuite, on utilise setProductData pour mettre à jour l'état productData avec la nouvelle valeur du champ modifié.
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value })); // Ici, on utilise la syntaxe de décomposition pour créer un nouvel objet qui contient toutes les propriétés de l'état productData précédent, mais avec la propriété modifiée mise à jour avec la nouvelle valeur. Cela permet de conserver les autres propriétés inchangées tout en mettant à jour uniquement la propriété modifiée.
  };

  const handleImageUpload = async (e) => {              // Ici, on crée une fonction handleImageUpload qui est appelée lorsque l'utilisateur sélectionne un fichier image à télécharger. Cette fonction utilise axios pour envoyer le fichier image au backend pour le téléchargement. On utilise FormData pour créer un objet qui contient le fichier image et on l'envoie au backend via une requête POST. Car axios ne peut pas envoyer directement des fichiers, on utilise FormData pour créer un objet qui contient le fichier image et on l'envoie au backend via une requête POST. On utilise également setUploading pour indiquer que le téléchargement de l'image est en cours, afin d'afficher un message de chargement pendant le téléchargement de l'image.
    const file = e.target.files[0];                     // Ici, on récupère le premier fichier sélectionné par l'utilisateur. e.target.files est une liste de fichiers sélectionnés par l'utilisateur, et on prend le premier fichier avec [0]. Cela permet de gérer le cas où l'utilisateur sélectionne plusieurs fichiers, mais on ne prend que le premier fichier pour le téléchargement.
    const formData = new FormData();                    // Ici, on crée un nouvel objet FormData qui sera utilisé pour envoyer le fichier image au backend. FormData est un objet qui permet de construire un ensemble de paires clé-valeur représentant les champs du formulaire et leurs valeurs. On utilise FormData pour envoyer des fichiers et des données de formulaire dans une requête HTTP.
    formData.append("image", file);                     // Ici, on ajoute le fichier image à l'objet FormData avec la clé "image". Cela permet au backend de savoir quel champ contient le fichier image lors de la réception de la requête. Le backend peut ensuite traiter le fichier image et le stocker dans le système de fichiers ou dans une base de données, selon la logique de l'application.

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Count In stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};
export default EditProductPage;
