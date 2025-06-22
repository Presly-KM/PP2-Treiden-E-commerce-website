import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);           // Ici on utilise le hook useSelector pour accéder à l'état de l'utilisateur dans le store Redux. On récupère l'utilisateur connecté depuis le slice auth, qui est géré par le reducer authSlice. Cela nous permet d'accéder aux informations de l'utilisateur, telles que son nom et son email, pour les afficher dans la page de profil. Si l'utilisateur n'est pas connecté, on redirige vers la page de connexion.
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {                                              // Ici on utilise le hook useEffect pour vérifier si l'utilisateur est connecté. Si l'utilisateur n'est pas connecté, on redirige vers la page de connexion. Cela permet de s'assurer que seuls les utilisateurs connectés peuvent accéder à la page de profil. Si l'utilisateur est connecté, on affiche ses informations de profil et ses commandes passées.
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);                                           // Le tableau de dépendances [user, navigate] permet de déclencher l'effet lorsque l'utilisateur change ou lorsque la fonction navigate change. Cela garantit que si l'utilisateur se connecte ou se déconnecte, l'effet sera exécuté pour rediriger vers la page de connexion si nécessaire.

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Section */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          {/* Right Section: Orders table */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
