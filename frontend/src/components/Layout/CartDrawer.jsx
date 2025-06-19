import { IoMdClose } from "react-icons/io"; // Importing the close icon from react-icons
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom to handle navigation

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {             // Ici on reçoit deux props : drawerOpen (un booléen qui indique si le tiroir du panier est ouvert ou fermé) et toggleCartDrawer (une fonction pour basculer l'état du tiroir du panier). les accolades ({}) sont utilisées pour déstructurer les props passées au composant CartDrawer. Cela permet d'accéder directement à drawerOpen et toggleCartDrawer sans avoir à écrire props.drawerOpen et props.toggleCartDrawer.
  const navigate = useNavigate();                                      // Importing useNavigate from react-router-dom to handle navigation
  const handleCheckout = () => {
    toggleCartDrawer();                                               // Closing the cart drawer when the checkout button is clicked
    navigate("/checkout");                                           // Navigating to the checkout page when the checkout button is clicked
  }
  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${ // Ici, on utilise des classes conditionnelles pour gérer le style du tiroir du panier. Si drawerOpen est "true", le tiroir est visible (translate-x-0), sinon il est caché (translate-x-full).
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>                         {/* Ici, on utilise la fonction toggleCartDrawer pour fermer le tiroir du panier lorsque l'utilisateur clique sur le bouton de fermeture. */}
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/*Cart contents with scrollable area*/}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <CartContents /> 
      </div>

      {/* Checkout button fixed at the bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        <button 
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 
          transition"
        >
          Checkout
        </button>
        <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
            Shipping, taxes, and discount codes calculated at checkout
        </p>
      </div>
    </div>
  );
};
export default CartDrawer;

{
  /*Quand on clique sur l'icône du panier, le tiroir ne se déploie pas, il reste fermé. Il faut vérifier si le composant CartDrawer est bien importé et utilisé dans le composant Navbar. Assurez-vous que le composant CartDrawer est inclus dans le JSX de Navbar et que les props drawerOpen et toggleCartDrawer sont correctement passées. 
 car il faut aussi appeler la fonction toggleCartDrawer (situé dans le bouton d'icone de panier) dans le composant Navbar. Ainsi a notre sens , Il est plus judicieux de déplacer l'etat local du tiroir du panier (CartDrawer) et la fonction toggleCartDrawer dans le composant Navbar. Avec ce changement on aura aussi besoin de passer drawerOpen et toggleCartDrawer au CartDrawer component puisque le "close button" utilise également toggleCartDrawer pour fermer le tiroir du panier (cf ligne 11 à ligne13).*/
}
