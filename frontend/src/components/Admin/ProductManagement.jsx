import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {                               // Ici, nous créons un composant ProductManagement qui gère l'affichage et la gestion des produits pour les administrateurs. Il utilise Redux pour récupérer les produits, gérer leur chargement et les erreurs, et permet aux administrateurs de supprimer des produits.
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(             // Ici, nous utilisons le hook useSelector pour accéder à l'état du store Redux. Nous récupérons les produits, l'état de chargement et les erreurs depuis le slice adminProductSlice. Cela nous permet d'afficher les produits, de gérer l'état de chargement et de gérer les erreurs dans notre composant.
    (state) => state.adminProducts                              // Ici, nous accédons à l'état du slice adminProducts dans le store Redux. Ce slice contient les produits administrés, l'état de chargement et les erreurs éventuelles. Nous utilisons useSelector pour accéder à cet état et le stocker dans des variables locales.
  );

  useEffect(() => {                                       
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {                                // Ici, nous créons une fonction handleDelete qui sera appelée lorsque l'administrateur cliquera sur le bouton de suppression d'un produit. Cette fonction prend en paramètre l'ID du produit à supprimer.
    if (window.confirm("Are you sure you want to delete the Product?")) {   // Ici, nous affichons une boîte de dialogue de confirmation pour demander à l'administrateur s'il est sûr de vouloir supprimer le produit. Si l'administrateur confirme, nous appelons la fonction dispatch pour supprimer le produit en utilisant l'action deleteProduct. 
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No Products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductManagement;
