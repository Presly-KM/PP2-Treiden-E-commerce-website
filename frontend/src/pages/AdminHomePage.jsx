import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {                                  // Ici, on crée un composant AdminHomePage qui représente la page d'accueil du tableau de bord administrateur. Ce composant est responsable de l'affichage des statistiques et des informations importantes pour les administrateurs.
  const dispatch = useDispatch();                              // On utilise useDispatch pour obtenir la fonction dispatch qui nous permet d'envoyer des actions à Redux. Cela nous permettra de déclencher des actions pour récupérer les produits et les commandes administratives.
  const {                                                      // On utilise useSelector pour accéder à l'état du store Redux. Cela nous permet de récupérer les données nécessaires pour afficher les statistiques et les informations importantes sur la page d'accueil du tableau de bord administrateur.
    products,                                                  // On récupère les produits depuis le store Redux. products est un tableau contenant les produits récupérés depuis la base de données.
    loading: productsLoading,                                  // On récupère les produits, l'état de chargement des produits et les erreurs éventuelles liées aux produits depuis le store Redux. products est un tableau contenant les produits, productsLoading est un booléen indiquant si les produits sont en cours de chargement, et productsError est une chaîne de caractères contenant une erreur éventuelle liée aux produits.
    error: productsError,                                      // On récupère les erreurs éventuelles liées aux produits depuis le store Redux. productsError est une chaîne de caractères contenant une erreur éventuelle liée aux produits.
  } = useSelector((state) => state.adminProducts);             // On utilise useSelector pour accéder à l'état du store Redux et récupérer les produits, l'état de chargement des produits et les erreurs éventuelles liées aux produits. state.adminProducts est le slice du store Redux qui contient les données des produits administratifs. N.B: Le state.adminProducts est le slice du store Redux qui contient les données des produits administratifs. Il est géré par le reducer adminProductSlice.js, qui est responsable de la récupération et de la gestion des produits administratifs dans l'application. Autre N.B: Le code ci-contre se lit de la manière suivante : on utilise le hook useSelector pour accéder à l'état du store Redux, puis on récupère les produits, l'état de chargement des produits et les erreurs éventuelles liées aux produits depuis le slice adminProducts. On utilise la déstructuration pour extraire ces valeurs directement depuis l'objet retourné par useSelector.
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);               // On utilise useSelector pour accéder à l'état du store Redux et récupérer les commandes, le nombre total de commandes, le chiffre d'affaires total, l'état de chargement des commandes et les erreurs éventuelles liées aux commandes. state.adminOrders est le slice du store Redux qui contient les données des commandes administratives. Il est géré par le reducer adminOrderSlice.js, qui est responsable de la récupération et de la gestion des commandes administratives dans l'application.

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {productsLoading || ordersLoading ? (
        <p>Loading ...</p>
      ) : productsError ? (
        <p className="text-red-500">Error fetching products: {productsError}</p>
      ) : ordersError ? (
        <p className="text-red-500">Error fetching orders: {ordersError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-2xl">${totalSales.toFixed(2)}</p>         {/* On affiche le chiffre d'affaires total avec deux décimales. totalSales est une variable qui contient le chiffre d'affaires total des commandes. On utilise toFixed(2) pour formater le chiffre d'affaires avec deux décimales, ce qui est courant pour les montants monétaires. */}
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-2xl">{totalOrders}</p>
            <Link to="/admin/orders" className="text-blue-500 hover:underline">
              Manage Orders
            </Link>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl">{products.length}</p>
            <Link
              to="/admin/products"
              className="text-blue-500 hover:underline"
            >
              Manage Products
            </Link>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name}</td>
                    <td className="p-4">{order.totalPrice.toFixed(2)}</td>  {/* On affiche le prix total de la commande avec deux décimales. order.totalPrice est une variable qui contient le prix total de la commande. On utilise toFixed(2) pour formater le prix avec deux décimales, ce qui est courant pour les montants monétaires. */}
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminHomePage;
