import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag, } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io"; // Assurez-vous d'avoir installé react-icons pour utiliser ces icônes



 

const Navbar = () => {

  const [drawerOpen, setDrawerOpen] = useState(false);                        // On veut ouvrir et fermer tiroir du panier (cart drawer) donc on utilise un état local pour gérer l'ouverture et la fermeture du tiroir du panier. Par défaut, il est fermé (false).
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);              
  
  const toggleNavDrawer = () => {                                               // Cette fonction est utilisée pour basculer l'état du tiroir de navigation entre ouvert et fermé. Elle est appelée lorsque l'utilisateur clique sur l'icône de menu.
    setNavDrawerOpen(!navDrawerOpen);                                          // Ici, on utilise la fonction setNavDrawerOpen pour inverser l'état actuel de navDrawerOpen. Si navDrawerOpen est "false", il devient "true" et vice versa.
  };

    const toggleCartDrawer = () => {                                            // Cette fonction est utilisée pour basculer l'état du tiroir du panier entre ouvert et fermé. Elle est appelée lorsque l'utilisateur clique sur l'icône du panier.
    setDrawerOpen(!drawerOpen);                                               // Ici, on utilise la fonction setDrawerOpen pour inverser l'état actuel de drawerOpen. Si drawerOpen est "false", il devient "true" et vice versa.
  };

  return (
    <>
      <nav
        className="container mx-auto flex items-center justify-between 
      py-4 px-6"
      >
        {/* Left - Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Treiden.
          </Link>
        </div>
        {/* Center - Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>
        {/* Right - Icons */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/admin"
            className="block bg-black px-2 rounded text-sm text-white"
            >
                Admin 
          </Link>
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button 
          onClick={toggleCartDrawer}                                                    // Ici, on utilise la fonction toggleCartDrawer pour ouvrir ou fermer le tiroir du panier lorsque l'utilisateur clique sur l'icône du panier.
          className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-rabbit-red text-white text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>
          { /* Search  */ }
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          
          <button onClick={toggleNavDrawer}className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700"/>
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>           {/* Ici, on utilise le composant CartDrawer pour afficher le tiroir du panier. On lui passe les props drawerOpen et toggleCartDrawer pour gérer son état d'ouverture et de fermeture. On pourra ensuite les utiliser dans le composant CartDrawer (CartDrawer.jsx) pour afficher ou masquer le tiroir du panier. */}
     
      {/*Mobile Navigation */}
      <div 
      className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform 
      transition-transform duration-300 z-50 ${
        navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        > 
      <div className="flex justify-end p-4">
        <button onClick={toggleNavDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        <nav className="space-y-4">
          <Link 
          to="#" 
          onClick={toggleNavDrawer} 
          className="block text-gray-600 hover:text-black "
          >
         Men
          </Link>
          <Link 
          to="#" 
          onClick={toggleNavDrawer} 
          className="block text-gray-600 hover:text-black "
          >
         Women
          </Link>
          <Link 
          to="#" 
          onClick={toggleNavDrawer} 
          className="block text-gray-600 hover:text-black "
          >
         Top Wear
          </Link>
          <Link 
          to="#" 
          onClick={toggleNavDrawer} 
          className="block text-gray-600 hover:text-black "
          >
         Bottom Wear
          </Link>
        </nav>
      </div>
      </div>
    </>
  );
};
export default Navbar;
