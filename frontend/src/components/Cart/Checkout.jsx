import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);  // Ici on veut récupérer le panier depuis le store Redux. En effet, on utilise le hook useSelector pour accéder à l'état du panier dans le store Redux. Le panier est stocké dans l'état du slice cart, qui est géré par le reducer cartSlice. Cela nous permet d'accéder aux produits du panier, au prix total et à d'autres informations pertinentes pour le processus de paiement.
  const { user } = useSelector((state) => state.auth);                  // Ici on veut récupérer l'utilisateur connecté depuis le store Redux. En effet, on utilise le hook useSelector pour accéder à l'état de l'utilisateur dans le store Redux. L'utilisateur est stocké dans l'état du slice auth, qui est géré par le reducer authSlice. Cela nous permet d'accéder aux informations de l'utilisateur, telles que son nom et son email, pour les afficher dans la page de paiement.

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {                 // Ici on vérifie si le panier est vide ou n'a pas de produits. Si c'est le cas, on redirige l'utilisateur vers la page d'accueil. Cela permet de s'assurer que l'utilisateur ne peut pas accéder à la page de paiement sans avoir ajouté des produits à son panier.
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {       // Ici on crée une fonction asynchrone handleCreateCheckout qui sera appelée lorsque l'utilisateur soumettra le formulaire de paiement. Cette fonction est responsable de la création d'un checkout avec les informations du panier et de l'adresse de livraison.
    e.preventDefault();
    if (cart && cart.products.length > 0) {         // On vérifie si le panier existe et s'il contient des produits avant de procéder à la création du checkout.
      const res = await dispatch(                   // On utilise le dispatch pour appeler l'action createCheckout avec les informations du panier, de l'adresse de livraison, du mode de paiement et du prix total.
        createCheckout({                            // On utilise createCheckout pour créer un checkout avec les informations du panier, de l'adresse de livraison, du mode de paiement et du prix total.
          checkoutItems: cart.products,             // On passe les produits du panier comme checkoutItems.
          shippingAddress,                          // On passe l'adresse de livraison comme shippingAddress.
          paymentMethod: "Paypal",                  // On utilise "Paypal" comme méthode de paiement. 
          totalPrice: cart.totalPrice,              // On passe le prix total du panier comme totalPrice.
        })
      );
      if (res.payload && res.payload._id) {          // On vérifie si la réponse contient un ID de checkout. Si c'est le cas, on met à jour l'état checkoutId avec cet ID.
        setCheckoutId(res.payload._id); // Set checkout ID if chekout was successful
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      await handleFinalizeCheckout(checkoutId); // Finalize checkout if payment is successful
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {           // Ici on crée une fonction asynchrone handleFinalizeCheckout qui sera appelée pour finaliser le checkout après le paiement réussi. Cette fonction envoie une requête PUT à l'API pour marquer le checkout comme finalisé.
    try {
      await axios.post(                                            // On utilise axios pour envoyer une requête POST à l'API pour finaliser le checkout.
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,   
          },
        }
      );
      navigate("/order-confirmation");                             // On redirige l'utilisateur vers la page de confirmation de commande après la finalisation du checkout.
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading cart ...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}          // Ici on utilise l'email de l'utilisateur connecté pour pré-remplir le champ email. Si l'utilisateur n'est pas connecté, le champ sera vide.
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert("Payment failed. Try again.")}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
