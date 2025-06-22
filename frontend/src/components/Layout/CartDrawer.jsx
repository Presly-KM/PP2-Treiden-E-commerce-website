import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth); // Ici on récupère l'utilisateur connecté ou l'ID invité depuis le store Redux. En effet, si l'utilisateur est connecté, on récupère ses informations, sinon on récupère l'ID de l'invité. state.auth contient les informations de l'utilisateur connecté ou de l'invité, et dans la ligne de code ci-dessous state.cart contient les informations du panier.
  const { cart } = useSelector((state) => state.cart);        // Ici on récupère le panier depuis le store Redux. State.cart contient les informations du panier, y compris les produits ajoutés au panier par l'utilisateur ou l'invité. On utilise useSelector pour accéder à ces informations depuis le store Redux, ce qui permet de gérer l'état du panier de manière centralisée dans l'application. useSelector est un hook de React-Redux qui permet de sélectionner une partie de l'état du store Redux. Dans ce cas, on utilise useSelector pour accéder à l'état du panier (cart) dans le store Redux. Cela permet de récupérer les informations du panier et de les utiliser dans le composant CartDrawer.
  const userId = user ? user._id : null;                       // Si l'utilisateur est connecté, on récupère son ID, sinon on le laisse à null

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button  */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/* Cart contents with scrollable area  */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Checkout button fixed at the bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
