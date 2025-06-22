import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom to handle navigation
import {logout} from "../../redux/slices/authSlice"; // Importing logout action from authSlice
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";


const AdminSidebar = () => {               // Ici, nous créons un composant AdminSidebar qui représente la barre latérale du tableau de bord administrateur. Il contient des liens de navigation vers différentes sections de l'administration, telles que les utilisateurs, les produits et les commandes.
    const navigate = useNavigate();        // Ici nous utilisons useNavigate de react-router-dom pour gérer la navigation dans l'application. useNavigate est un hook qui permet de naviguer vers une autre page ou de rediriger l'utilisateur vers une autre page. Il est utilisé pour rediriger l'utilisateur vers la page d'accueil après la déconnexion.
     const dispatch = useDispatch();
    
     const handleLogout = () => {          // Ici, nous définissons une fonction handleLogout qui sera appelée lorsque l'utilisateur cliquera sur le bouton de déconnexion. Cette fonction va déclencher l'action de déconnexion et effacer le panier.
        dispatch(logout());
        dispatch(clearCart());
      navigate("/");                        // Redirect to home page on logout
    }
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
            Treiden.
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center"> Admin Dashboard</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaUser />
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button onClick={handleLogout} 
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center 
        justify-center space-x-2"
        >
            <FaSignOutAlt />
            <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
