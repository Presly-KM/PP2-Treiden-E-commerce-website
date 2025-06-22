import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);    // On récupère l'utilisateur connecté depuis le store Redux. En effet, on utilise le hook useSelector pour accéder à l'état de l'utilisateur dans le store Redux. L'utilisateur est stocké dans l'état du slice auth, qui est géré par le reducer authSlice.
  const { orders, loading, error } = useSelector((state) => state.adminOrders);  // On récupère les commandes de l'admin depuis le store Redux. En effet, on utilise le hook useSelector pour accéder à l'état des commandes dans le store Redux. Les commandes sont stockées dans l'état du slice adminOrders, qui est géré par le reducer adminOrderSlice.

  useEffect(() => {                                       // Ici, on va vérifier si l'utilisateur est un admin avant de charger les commandes 
    if (!user || user.role !== "admin") {                 // Si l'utilisateur n'est pas connecté ou n'est pas un admin, on le redirige vers la page d'accueil.
      navigate("/");                                      // On redirige l'utilisateur vers la page d'accueil s'il n'est pas connecté ou n'est pas un admin.
    } else {                                              // Si l'utilisateur est connecté et est un admin, on charge les commandes.
      dispatch(fetchAllOrders());                         // On utilise la fonction fetchAllOrders pour charger toutes les commandes de l'admin.
    }
  }, [dispatch, user, navigate]);                         // On utilise useEffect pour charger les commandes de l'admin lorsque le composant est monté ou lorsque l'utilisateur change.

  const handleStatusChange = (orderId, status) => {       // On crée une fonction pour gérer le changement de statut d'une commande. Cette fonction sera appelée lorsque l'utilisateur sélectionne un nouveau statut dans le menu déroulant.
    dispatch(updateOrderStatus({ id: orderId, status })); // On utilise la fonction updateOrderStatus pour mettre à jour le statut de la commande. On passe l'ID de la commande et le nouveau statut en paramètre.
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user.name}</td>
                  <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrderManagement;



/* ------- START OF BACKEND CODE -------

On commence le backend :

        - On va créer un API qui va être utilisé par notre app React pour commmuniquer avec le backend.
        - Pour gérer notre app Node.js, on va utiliser la commande npm init -y0. Cette commande va créer un fichier package.json destiné à installer et gérer les dépendances dans notre projet.
        
        - On aura besoin d'installer les dépendances suivantes :

           - express : pour créer notre serveur web. C'est le framework web le plus populaire pour Node.js. On va l'utiliser pour gérer les routes, les requêtes et les réponses HTTP. Notre API.
           - mongoose : pour interagir avec MongoDB. C'est un ODM (Object Data Modeling) qui facilite la manipulation des données dans MongoDB en utilisant des modèles. Il nous permet de définir des schémas pour nos données et de les valider avant de les enregistrer dans la base de données.
           - dotenv : pour gérer les variables d'environnement et les configurations sensibles. On va l'utiliser pour stocker des informations comme les clés API, les mots de passe, etc., sans les exposer dans le code sourcen grâce à un fichier .env.
           - jsonwebtoken : pour gérer l'authentification JWT (JSON Web Token). C'est une méthode sécurisée pour authentifier les utilisateurs et gérer les sessions. 
           - bcryptjs : pour le hachage des mots de passe.
           - cors : pour gérer les requêtes cross-origin resource sharing (CORS). C'est important pour permettre à notre frontend React de communiquer avec notre backend Node.js sans problèmes de sécurité liés aux politiques de même origine. C'est à dire que notre frontend et notre backend peuvent être sur des domaines différents, mais on veut quand même qu'ils puissent communiquer entre eux. Par exemple, si notre frontend est sur http://localhost:3000 et notre backend sur http://localhost:5000, on doit configurer CORS pour autoriser les requêtes entre ces deux domaines.
           - nodemon : pour redémarrer automatiquement le serveur lors des changements de code (en développement). Il nous aidera à ne pas avoir à redémarrer manuellement le serveur à chaque fois qu'on fait une modification dans le code.     
        
        */