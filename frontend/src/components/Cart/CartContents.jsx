import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";                                   // On importe useDispatch de react-redux pour pouvoir envoyer des actions à Redux. Cela permet de mettre à jour l'état du panier dans le store Redux en fonction des actions dispatchées. Par exemple, on peut utiliser dispatch pour ajouter un produit au panier, supprimer un produit du panier ou mettre à jour la quantité d'un produit dans le panier. Cela permet de gérer l'état du panier de manière centralisée dans Redux et de synchroniser l'état du panier avec l'interface utilisateur.
import {
  removeFromCart,                                                            // On importe l'action removeFromCart pour supprimer un produit du panier. Cette action est définie dans le slice cartSlice.js et permet de mettre à jour l'état du panier dans le store Redux en supprimant un produit spécifique du panier. On utilise cette action pour gérer la suppression d'un produit du panier dans l'interface utilisateur.
  updateCartItemQuantity,                                                    // On importe l'action updateCartItemQuantity pour mettre à jour la quantité d'un produit dans le panier. Cette action est définie dans le slice cartSlice.js et permet de mettre à jour l'état du panier dans le store Redux en modifiant la quantité d'un produit spécifique dans le panier. On utilise cette action pour gérer la mise à jour de la quantité d'un produit dans l'interface utilisateur.
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {                        // Ici on utilise les props pour passer le panier, l'ID utilisateur et l'ID invité. En effet, le panier peut être vide si l'utilisateur n'est pas connecté, donc on utilise les props pour gérer cela. Par exemple, si l'utilisateur n'est pas connecté, on peut passer un ID invité pour gérer le panier de l'utilisateur invité. On utilise également les props pour passer l'ID utilisateur si l'utilisateur est connecté. Cela permet de gérer le panier de l'utilisateur connecté et de l'utilisateur invité de manière flexible. 
  const dispatch = useDispatch();                                            // On utilise useDispatch pour envoyer des actions à Redux. Cela permet de mettre à jour le panier dans le store Redux en fonction des actions dispatchées. Par exemple, on peut utiliser dispatch pour ajouter un produit au panier, supprimer un produit du panier ou mettre à jour la quantité d'un produit dans le panier. Cela permet de gérer l'état du panier de manière centralisée dans Redux et de synchroniser l'état du panier avec l'interface utilisateur.

  // Handle adding or substracting to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {     // Ici, on utilise une fonction handleAddToCart pour gérer l'ajout ou la soustraction d'un produit au panier. Cette fonction prend en paramètres l'ID du produit, le delta (qui peut être positif ou négatif), la quantité actuelle du produit, la taille et la couleur du produit. Le delta est utilisé pour déterminer si on ajoute ou soustrait un produit du panier. Par exemple, si delta est égal à 1, on ajoute un produit au panier, et si delta est égal à -1, on soustrait un produit du panier.
    const newQuantity = quantity + delta;                                    // On calcule la nouvelle quantité du produit en ajoutant le delta à la quantité actuelle du produit. Cela permet de mettre à jour la quantité du produit dans le panier en fonction de l'action de l'utilisateur (ajout ou soustraction).
    if (newQuantity >= 1) {                                                  // On vérifie si la nouvelle quantité est supérieure ou égale à 1. Si c'est le cas, on peut mettre à jour la quantité du produit dans le panier. Si la nouvelle quantité est inférieure à 1, on ne met pas à jour la quantité du produit dans le panier, car cela signifierait que l'utilisateur essaie de supprimer le produit du panier.
      dispatch(                                                              // On utilise dispatch pour envoyer une action à Redux pour mettre à jour la quantité du produit dans le panier. Cette action est définie dans le slice cartSlice.js et permet de mettre à jour l'état du panier dans le store Redux.
        updateCartItemQuantity({                                             // On utilise l'action updateCartItemQuantity pour mettre à jour la quantité du produit dans le panier. Cette action prend en paramètres l'ID du produit, la nouvelle quantité, l'ID de l'invité (guestId), l'ID de l'utilisateur (userId), la taille et la couleur du produit.
          productId,                                                         // On passe l'ID du produit à mettre à jour.
          quantity: newQuantity,                                             // On passe la nouvelle quantité du produit.
          guestId,                                                           // On passe l'ID de l'invité (guestId) pour gérer le panier de l'utilisateur invité.
          userId,                                                            // On passe l'ID de l'utilisateur (userId) pour gérer le panier de l'utilisateur connecté.
          size,                                                              // On passe la taille du produit.
          color,                                                             // On passe la couleur du produit.
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {                // Ici, on utilise une fonction handleRemoveFromCart pour gérer la suppression d'un produit du panier. Cette fonction prend en paramètres l'ID du produit, la taille et la couleur du produit à supprimer du panier.
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));   // On utilise dispatch pour envoyer une action à Redux pour supprimer le produit du panier. Cette action est définie dans le slice cartSlice.js et permet de mettre à jour l'état du panier dans le store Redux en supprimant le produit spécifique du panier. On passe l'ID du produit, l'ID de l'invité (guestId), l'ID de l'utilisateur (userId), la taille et la couleur du produit à supprimer. Remarque : on utilise ici l'action removeFromCart pour supprimer le produit du panier. Cette action est définie dans le slice cartSlice.js et permet de mettre à jour l'état du panier dans le store Redux en supprimant un produit spécifique du panier.
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-20 sm:w-20 sm:h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                size: {product.size} | color: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>                                                  // Ici, on appelle la fonction handleAddToCart pour gérer l'ajout ou la soustraction d'un produit au panier. Cette fonction est appelée lorsque l'utilisateur clique sur le bouton de soustraction (-) ou d'ajout (+) pour modifier la quantité du produit dans le panier.
                    handleAddToCart(
                      product.productId,                                          // On passe l'ID du produit à mettre à jour.
                      -1,
                      product.quantity,                                           // On passe la quantité actuelle du produit pour mettre à jour la quantité dans le panier.
                      product.size,                                               // On passe la taille du produit pour mettre à jour la quantité dans le panier.
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium">$ {product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(                // Ici, on appelle la fonction handleRemoveFromCart pour gérer la suppression d'un produit du panier. Cette fonction est appelée lorsque l'utilisateur clique sur le bouton de suppression (icône de corbeille).
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default CartContents;
